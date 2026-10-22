import {
  WebGLRenderer, Scene, OrthographicCamera, Group, BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial,
  BufferGeometry, Float32BufferAttribute, SphereGeometry, MeshBasicMaterial, Mesh, Vector3,
} from 'three';

const COLUMNS = [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]];
const SIZE = 3.2;

// Monte la scène dans el ; renvoie la fonction de nettoyage, ou null sans WebGL
export function mountStackScene(el, layers, labelEls) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
  el.prepend(renderer.domElement);

  const scene = new Scene();
  const camera = new OrthographicCamera();
  camera.position.set(10, 8, 10);
  camera.lookAt(0, 0, 0);
  const stack = new Group();
  scene.add(stack);

  const accentLine = new LineBasicMaterial();
  const ruleLine = new LineBasicMaterial({ transparent: true, opacity: 0.55 });
  const packetMat = new MeshBasicMaterial();
  const fillMat = new MeshBasicMaterial({ transparent: true, opacity: 0.1, depthWrite: false });
  const disposables = [accentLine, ruleLine, packetMat, fillMat];
  const track = (o) => { disposables.push(o.geometry); return o; };

  const slab = new BoxGeometry(SIZE, 0.16, SIZE);
  const slabEdges = new EdgesGeometry(slab);
  // Grille intérieure seulement : son bord masquerait le contour de la plaque
  const h = SIZE / 2;
  const inner = [-h / 2, 0, h / 2].flatMap((v) => [v, 0, -h, v, 0, h, -h, 0, v, h, 0, v]);
  const grid = new BufferGeometry();
  grid.setAttribute('position', new Float32BufferAttribute(inner, 3));
  disposables.push(slab, slabEdges, grid);
  for (const { y } of layers) {
    const edges = new LineSegments(slabEdges, accentLine);
    const fill = new Mesh(slab, fillMat);
    const lines = new LineSegments(grid, ruleLine);
    edges.position.y = y;
    fill.position.y = y;
    lines.position.y = y + 0.081;
    stack.add(fill, lines, edges);
  }

  // Canalisations verticales entre les plaques
  const top = layers[0].y;
  const bottom = layers.at(-1).y;
  const pipes = new BufferGeometry();
  pipes.setAttribute('position', new Float32BufferAttribute(
    COLUMNS.flatMap(([x, z]) => [x, top, z, x, bottom, z]), 3));
  stack.add(track(new LineSegments(pipes, ruleLine)));

  // Une requête par canalisation, décalées dans le temps, aller-retour haut -> bas
  const packetGeo = new SphereGeometry(0.12, 16, 12);
  disposables.push(packetGeo);
  const packets = COLUMNS.map(([x, z], i) => {
    const m = new Mesh(packetGeo, packetMat);
    m.position.set(x, 0, z);
    m.userData.phase = i / COLUMNS.length;
    stack.add(m);
    return m;
  });

  function applyColors() {
    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue('--accent').trim();
    accentLine.color.set(accent);
    packetMat.color.set(accent);
    fillMat.color.set(accent);
    ruleLine.color.set(css.getPropertyValue('--rule-strong').trim());
  }

  function resize() {
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    const half = 3.4;
    const [hw, hh] = aspect >= 1 ? [half * aspect, half] : [half, half / aspect];
    Object.assign(camera, { left: -hw, right: hw, top: hh, bottom: -hh });
    camera.updateProjectionMatrix();
  }

  const corner = new Vector3();
  function placeLabels() {
    const w = el.clientWidth;
    const h = el.clientHeight;
    layers.forEach(({ y }, i) => {
      corner.set(SIZE / 2, y, -SIZE / 2);
      stack.localToWorld(corner).project(camera);
      const label = labelEls[i];
      if (label) label.style.transform = `translate(${((corner.x + 1) / 2) * w + 12}px, ${((1 - corner.y) / 2) * h - 10}px)`;
    });
  }

  const pointer = { x: 0, y: 0 };
  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  function draw() {
    placeLabels();
    renderer.render(scene, camera);
  }

  function tick(time) {
    const t = time / 1000;
    stack.rotation.y += (pointer.x * 0.45 + Math.sin(t * 0.25) * 0.12 - stack.rotation.y) * 0.05;
    stack.rotation.x += (pointer.y * 0.08 - stack.rotation.x) * 0.05;
    for (const p of packets) {
      const k = (t * 0.22 + p.userData.phase) % 1;
      const tri = k < 0.5 ? k * 2 : 2 - k * 2;
      p.position.y = top - tri * (top - bottom);
    }
    draw();
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  let visible = true;
  const loop = () => renderer.setAnimationLoop(visible && !reduced.matches ? tick : null);
  const onTheme = () => { applyColors(); draw(); };
  const onMotion = () => { loop(); draw(); };

  const resizeObs = new ResizeObserver(() => { resize(); draw(); });
  const visObs = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; loop(); });
  resizeObs.observe(el);
  visObs.observe(el);
  window.addEventListener('pointermove', onPointer, { passive: true });
  dark.addEventListener('change', onTheme);
  reduced.addEventListener('change', onMotion);

  applyColors();
  resize();
  draw();
  loop();

  return () => {
    renderer.setAnimationLoop(null);
    resizeObs.disconnect();
    visObs.disconnect();
    window.removeEventListener('pointermove', onPointer);
    dark.removeEventListener('change', onTheme);
    reduced.removeEventListener('change', onMotion);
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
