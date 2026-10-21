<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiService, parseTechs } from '@/services/api';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import ErrorBanner from '../components/ErrorBanner.vue';
import SpinnerIcon from '../components/SpinnerIcon.vue';

const route = useRoute();
const router = useRouter();
// Relu à chaque appel : un token retiré entre-temps doit renvoyer vers le login
const authToken = () => localStorage.getItem('token');

const TABS = [
  { id: 'projects', label: 'Projets' },
  { id: 'experiences', label: 'Parcours' },
  { id: 'profile', label: 'Profil' },
];
const activeTab = computed(() => TABS.find((t) => t.id === route.query.tab) ?? TABS[0]);

const RESOURCES = {
  projects: {
    fetch: apiService.getProjects,
    create: apiService.createProject,
    update: apiService.updateProject,
    remove: apiService.deleteProject,
    empty: { title: '', technologies: '', description: '', projectUrl: '', repoUrl: '' },
    text: {
      add: 'Ajouter un projet',
      edit: 'Modifier le projet',
      submitNew: 'Ajouter le projet',
      created: 'Projet ajouté',
      updated: 'Projet modifié',
      notSaved: "Le projet n'a pas été enregistré",
      none: "Aucun projet pour l'instant. Les projets ajoutés ici apparaissent sur la page d'accueil.",
      deleteTitle: 'Supprimer ce projet ?',
      deleteConfirm: 'Supprimer le projet',
      removed: 'retiré',
      deleted: 'Projet supprimé',
    },
  },
  experiences: {
    fetch: apiService.getExperiences,
    create: apiService.createExperience,
    update: apiService.updateExperience,
    remove: apiService.deleteExperience,
    empty: { title: '', organization: '', type: 'work', startDate: '', endDate: '', description: '' },
    text: {
      add: 'Ajouter une étape',
      edit: "Modifier l'étape",
      submitNew: "Ajouter l'étape",
      created: 'Étape ajoutée',
      updated: 'Étape modifiée',
      notSaved: "L'étape n'a pas été enregistrée",
      none: "Aucune étape de parcours pour l'instant. Les étapes ajoutées ici apparaissent sur la page d'accueil.",
      deleteTitle: 'Supprimer cette étape ?',
      deleteConfirm: "Supprimer l'étape",
      removed: 'retirée',
      deleted: 'Étape supprimée',
    },
  },
};
const resource = computed(() => RESOURCES[activeTab.value.id]);

// --- DONNÉES ---
const lists = reactive({ projects: [], experiences: [] });
const loadStatus = ref('loading'); // 'loading' | 'ok' | 'error'
const panelHeading = ref(null);

function handleAuthError(err) {
  if (err.status !== 401) return false;
  localStorage.removeItem('token');
  router.push({ path: '/login', query: { expire: '1' } });
  return true;
}

async function loadAll() {
  loadStatus.value = 'loading';
  try {
    const [projects, experiences, prof] = await Promise.all([
      apiService.getProjects(),
      apiService.getExperiences(),
      apiService.getProfile().catch((err) => {
        if (err.status === 404) return {};
        throw err;
      }),
    ]);
    lists.projects = projects;
    lists.experiences = experiences;
    setProfile(prof);
    loadStatus.value = 'ok';
  } catch (err) {
    if (!handleAuthError(err)) loadStatus.value = 'error';
  }
}

// Rechargement après sauvegarde : la liste reste affichée, un échec garde l'ancienne
async function reloadList(kind) {
  try {
    lists[kind] = await RESOURCES[kind].fetch();
  } catch (err) {
    handleAuthError(err);
  }
}

onMounted(loadAll);

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

// --- TOAST ---
const toast = ref('');
let toastTimer;
function showToast(message) {
  toast.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value = ''), 4000);
}

// --- ABANDON DES MODIFICATIONS ---
const discardDialog = ref(null);
let onDiscard = null;
function askDiscard(callback) {
  onDiscard = callback;
  discardDialog.value.open();
}
function confirmDiscard() {
  discardDialog.value.close();
  onDiscard();
}

// --- DIALOGUES D'ÉDITION (projet, étape) ---
function useEditor(kind, dialog) {
  const { create, update, empty, text } = RESOURCES[kind];
  const item = ref({});
  const saving = ref(false);
  const error = ref('');
  let snapshot = '';

  async function open(existing) {
    item.value = { ...(existing ?? empty) };
    snapshot = JSON.stringify(item.value);
    error.value = '';
    await nextTick();
    dialog.value.showModal();
  }

  function requestClose() {
    if (JSON.stringify(item.value) === snapshot) dialog.value.close();
    else askDiscard(() => dialog.value.close());
  }

  async function save() {
    const isNew = !item.value.id;
    saving.value = true;
    error.value = '';
    try {
      if (isNew) await create(item.value, authToken());
      else await update(item.value.id, item.value, authToken());
    } catch (err) {
      if (!handleAuthError(err)) error.value = `${text.notSaved} : ${err.message}. Vos saisies sont conservées.`;
      return;
    } finally {
      saving.value = false;
    }
    dialog.value.close();
    showToast(isNew ? text.created : text.updated);
    await reloadList(kind);
  }

  return reactive({ item, saving, error, open, requestClose, save, isNew: computed(() => !item.value.id) });
}

const projectDialog = ref(null);
const experienceDialog = ref(null);
const editors = {
  projects: useEditor('projects', projectDialog),
  experiences: useEditor('experiences', experienceDialog),
};
const projectEditor = editors.projects;
const experienceEditor = editors.experiences;

// --- SUPPRESSION ---
const deleteDialog = ref(null);
const pendingDelete = ref(null); // { kind, item }
const deleting = ref(false);
const deleteError = ref('');
const deleteText = computed(() => RESOURCES[pendingDelete.value?.kind ?? 'projects'].text);
const deleteMessage = computed(() => pendingDelete.value
  && `« ${pendingDelete.value.item.title} » sera ${deleteText.value.removed} du site.\nCette action est définitive.`);

function askDelete(kind, item) {
  pendingDelete.value = { kind, item };
  deleteError.value = '';
  deleteDialog.value.open();
}

async function confirmDelete() {
  const { kind, item } = pendingDelete.value;
  deleting.value = true;
  deleteError.value = '';
  try {
    await RESOURCES[kind].remove(item.id, authToken());
  } catch (err) {
    if (!handleAuthError(err)) deleteError.value = `La suppression a échoué : ${err.message}.`;
    return;
  } finally {
    deleting.value = false;
  }
  deleteDialog.value.close();
  lists[kind] = lists[kind].filter((x) => x.id !== item.id);
  showToast(deleteText.value.deleted);
  panelHeading.value.focus();
}

// --- PROFIL ---
const profile = ref({});
const profileSnapshot = ref('');
const profileDirty = computed(() => JSON.stringify(profile.value) !== profileSnapshot.value);
const profileSaving = ref(false);
const profileSavedAt = ref('');
const profileError = ref('');

function setProfile(value) {
  profile.value = value;
  profileSnapshot.value = JSON.stringify(value);
}

async function saveProfile() {
  profileSaving.value = true;
  profileError.value = '';
  try {
    await apiService.updateProfile(profile.value, authToken());
    profileSnapshot.value = JSON.stringify(profile.value);
    profileSavedAt.value = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    if (!handleAuthError(err)) profileError.value = err.message;
  } finally {
    profileSaving.value = false;
  }
}

// --- AFFICHAGE ---
function shortUrl(url, withPath) {
  try {
    const u = new URL(url);
    return withPath ? `${u.host}${u.pathname}`.replace(/\/$/, '') : u.host;
  } catch {
    return url;
  }
}
const projectLinks = (p) => [
  p.projectUrl && `Site : ${shortUrl(p.projectUrl, false)}`,
  p.repoUrl && `Code : ${shortUrl(p.repoUrl, true)}`,
].filter(Boolean).join(' · ') || 'Aucun lien';
</script>

<template>
  <div class="min-h-dvh text-base">
    <header class="border-b border-rule bg-surface">
      <div class="mx-auto max-w-5xl px-4 sm:px-6">
        <div class="flex flex-wrap items-center justify-between gap-3 py-3">
          <p class="font-wide font-bold text-ink">Administration</p>
          <div class="flex flex-wrap items-center gap-4">
            <RouterLink to="/" class="link">Voir le site</RouterLink>
            <button type="button" class="btn-secondary" @click="logout">Se déconnecter</button>
          </div>
        </div>
        <nav aria-label="Sections de l'administration">
          <ul class="flex flex-wrap gap-x-6">
            <li v-for="tab in TABS" :key="tab.id">
              <RouterLink
                :to="{ query: { tab: tab.id } }"
                class="inline-flex min-h-11 items-center gap-2 border-b-2 px-1 font-medium transition-colors duration-fast"
                :class="tab.id === activeTab.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'"
                :aria-current="tab.id === activeTab.id ? 'page' : undefined"
              >
                {{ tab.label }}
                <span v-if="loadStatus === 'ok' && tab.id in lists" class="font-condensed text-meta text-muted tabular-nums">{{ lists[tab.id].length }}</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main id="contenu" tabindex="-1" class="mx-auto max-w-5xl px-4 py-8 focus:outline-none sm:px-6">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 ref="panelHeading" tabindex="-1" class="font-wide text-section font-bold text-ink">{{ activeTab.label }}</h1>
        <button v-if="resource && loadStatus === 'ok'" type="button" class="btn-primary" @click="editors[activeTab.id].open()">
          {{ resource.text.add }}
        </button>
      </div>

      <div v-if="loadStatus === 'loading'" aria-busy="true" class="divide-y divide-rule rounded-lg border border-rule bg-surface">
        <div v-for="n in 3" :key="n" class="space-y-2 p-4 sm:p-5">
          <div class="skeleton h-5 w-1/3"></div>
          <div class="skeleton h-4 w-1/4"></div>
          <div class="skeleton h-4 w-2/3"></div>
        </div>
      </div>

      <ErrorBanner v-else-if="loadStatus === 'error'">
        Les données n'ont pas pu être chargées.
        <template #action>
          <button type="button" class="btn-secondary" @click="loadAll">Réessayer</button>
        </template>
      </ErrorBanner>

      <!-- PROJETS / PARCOURS -->
      <template v-else-if="resource">
        <div v-if="!lists[activeTab.id].length" class="rounded-lg border border-dashed border-rule-strong p-8 text-center">
          <p class="mx-auto max-w-prose text-ink-soft">{{ resource.text.none }}</p>
          <button type="button" class="btn-primary mt-4" @click="editors[activeTab.id].open()">{{ resource.text.add }}</button>
        </div>

        <ul v-else class="divide-y divide-rule rounded-lg border border-rule bg-surface">
          <li v-for="item in lists[activeTab.id]" :key="item.id" class="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
            <div class="min-w-0">
              <h2 class="font-bold text-ink [overflow-wrap:anywhere]">{{ item.title }}</h2>
              <template v-if="activeTab.id === 'projects'">
                <p class="font-condensed text-meta text-muted">{{ parseTechs(item.technologies).join(', ') }}</p>
                <p class="mt-1 line-clamp-2 text-sm text-ink-soft">{{ item.description }}</p>
                <p class="mt-2 truncate font-condensed text-meta text-muted">{{ projectLinks(item) }}</p>
              </template>
              <template v-else>
                <p class="flex flex-wrap items-center gap-x-1.5 font-condensed text-meta text-muted tabular-nums">
                  <span aria-hidden="true" class="size-2 border-[1.5px] border-current" :class="{ 'bg-current': item.type === 'work' }"></span>
                  {{ item.type === 'work' ? 'Poste' : 'Formation' }} · {{ item.organization }} · {{ item.startDate }} – {{ item.endDate || 'aujourd’hui' }}
                </p>
                <p v-if="item.description" class="mt-1 line-clamp-2 text-sm text-ink-soft">{{ item.description }}</p>
              </template>
            </div>
            <div class="flex shrink-0 gap-2">
              <button type="button" class="btn-secondary" @click="editors[activeTab.id].open(item)">
                Modifier<span class="sr-only"> « {{ item.title }} »</span>
              </button>
              <button type="button" class="btn-danger-outline" @click="askDelete(activeTab.id, item)">
                Supprimer<span class="sr-only"> « {{ item.title }} »</span>
              </button>
            </div>
          </li>
        </ul>
      </template>

      <!-- PROFIL -->
      <form v-else class="max-w-2xl rounded-lg border border-rule bg-surface p-5 sm:p-6" @submit.prevent="saveProfile">
        <div class="space-y-5">
          <div>
            <label for="profile-name" class="label">Nom</label>
            <input id="profile-name" v-model="profile.name" class="field" required aria-describedby="profile-name-help">
            <p id="profile-name-help" class="help">Affiché en très grand en haut de la page d'accueil.</p>
          </div>
          <div>
            <label for="profile-title" class="label">Titre</label>
            <input id="profile-title" v-model="profile.title" class="field" placeholder="ex. Développeur web full-stack" required>
          </div>
          <div>
            <label for="profile-intro" class="label">Introduction <span class="font-normal text-muted">(facultatif)</span></label>
            <textarea id="profile-intro" v-model="profile.introduction" rows="6" class="field" aria-describedby="profile-intro-help"></textarea>
            <p id="profile-intro-help" class="help">Affichée sous votre nom. Les retours à la ligne sont conservés.</p>
          </div>
        </div>
        <div class="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" class="btn-primary" :disabled="!profileDirty || profileSaving" :aria-busy="profileSaving">
            <SpinnerIcon v-if="profileSaving" />
            {{ profileSaving ? 'Enregistrement…' : 'Enregistrer le profil' }}
          </button>
          <p role="status" aria-live="polite" class="text-meta">
            <span v-if="profileDirty" class="text-muted">Modifications non enregistrées</span>
            <span v-else-if="profileSavedAt" class="inline-flex items-center gap-1.5 font-medium text-success">
              <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
              Profil enregistré à {{ profileSavedAt }}
            </span>
          </p>
        </div>
        <ErrorBanner v-if="profileError" class="mt-6">Le profil n'a pas été enregistré : {{ profileError }}. Réessayez.</ErrorBanner>
      </form>
    </main>

    <!-- DIALOGUE PROJET -->
    <dialog
      ref="projectDialog"
      aria-labelledby="project-dialog-title"
      class="w-full max-w-xl rounded-lg bg-surface p-0 text-base text-ink shadow-overlay open:flex open:flex-col max-sm:m-0 max-sm:h-dvh max-sm:max-h-none max-sm:max-w-none max-sm:rounded-none"
      @cancel.prevent="projectEditor.requestClose()"
    >
      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="projectEditor.save()">
        <div class="flex items-center justify-between gap-4 border-b border-rule py-2 pl-5 pr-2">
          <h2 id="project-dialog-title" class="text-lg font-bold">{{ projectEditor.isNew ? RESOURCES.projects.text.add : RESOURCES.projects.text.edit }}</h2>
          <button type="button" class="inline-flex size-11 items-center justify-center rounded-md text-muted hover:text-ink" aria-label="Fermer" @click="projectEditor.requestClose()">
            <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div class="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div>
            <label for="project-title" class="label">Titre</label>
            <input id="project-title" v-model="projectEditor.item.title" class="field" autofocus required>
          </div>
          <div>
            <label for="project-techs" class="label">Technologies</label>
            <input id="project-techs" v-model="projectEditor.item.technologies" class="field" required aria-describedby="project-techs-help">
            <p id="project-techs-help" class="help">Séparez par des virgules : Vue.js, Node.js, Tailwind CSS</p>
            <ul v-if="parseTechs(projectEditor.item.technologies).length" aria-label="Aperçu des technologies" class="mt-2 flex flex-wrap gap-2">
              <li v-for="(t, i) in parseTechs(projectEditor.item.technologies)" :key="i" class="chip">{{ t }}</li>
            </ul>
          </div>
          <div>
            <label for="project-description" class="label">Description</label>
            <textarea id="project-description" v-model="projectEditor.item.description" rows="5" class="field" required aria-describedby="project-description-help"></textarea>
            <p id="project-description-help" class="help">Les retours à la ligne sont conservés sur le site.</p>
          </div>
          <div>
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="project-url" class="label">Site en ligne <span class="font-normal text-muted">(facultatif)</span></label>
                <input id="project-url" v-model="projectEditor.item.projectUrl" type="url" class="field" placeholder="https://…" aria-describedby="project-urls-help">
              </div>
              <div>
                <label for="project-repo" class="label">Code source <span class="font-normal text-muted">(facultatif)</span></label>
                <input id="project-repo" v-model="projectEditor.item.repoUrl" type="url" class="field" placeholder="https://…" aria-describedby="project-urls-help">
              </div>
            </div>
            <p id="project-urls-help" class="help">Laisser vide si le projet n'est pas en ligne.</p>
          </div>
        </div>
        <div class="space-y-3 border-t border-rule px-5 py-4">
          <ErrorBanner v-if="projectEditor.error">{{ projectEditor.error }}</ErrorBanner>
          <div class="flex justify-end gap-3">
            <button type="button" class="btn-secondary" @click="projectEditor.requestClose()">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="projectEditor.saving" :aria-busy="projectEditor.saving">
              <SpinnerIcon v-if="projectEditor.saving" />
              <template v-if="projectEditor.saving">Enregistrement…</template>
              <template v-else>{{ projectEditor.isNew ? RESOURCES.projects.text.submitNew : 'Enregistrer' }}</template>
            </button>
          </div>
        </div>
      </form>
    </dialog>

    <!-- DIALOGUE ÉTAPE -->
    <dialog
      ref="experienceDialog"
      aria-labelledby="experience-dialog-title"
      class="w-full max-w-xl rounded-lg bg-surface p-0 text-base text-ink shadow-overlay open:flex open:flex-col max-sm:m-0 max-sm:h-dvh max-sm:max-h-none max-sm:max-w-none max-sm:rounded-none"
      @cancel.prevent="experienceEditor.requestClose()"
    >
      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="experienceEditor.save()">
        <div class="flex items-center justify-between gap-4 border-b border-rule py-2 pl-5 pr-2">
          <h2 id="experience-dialog-title" class="text-lg font-bold">{{ experienceEditor.isNew ? RESOURCES.experiences.text.add : RESOURCES.experiences.text.edit }}</h2>
          <button type="button" class="inline-flex size-11 items-center justify-center rounded-md text-muted hover:text-ink" aria-label="Fermer" @click="experienceEditor.requestClose()">
            <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div class="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="exp-title" class="label">Intitulé</label>
              <input id="exp-title" v-model="experienceEditor.item.title" class="field" placeholder="ex. Développeur full-stack" autofocus required>
            </div>
            <div>
              <label for="exp-org" class="label">Organisation</label>
              <input id="exp-org" v-model="experienceEditor.item.organization" class="field" required>
            </div>
          </div>
          <fieldset>
            <legend class="label">Type</legend>
            <div class="flex flex-wrap gap-x-6">
              <label class="inline-flex min-h-11 cursor-pointer items-center gap-2">
                <input v-model="experienceEditor.item.type" type="radio" name="exp-type" value="work" class="size-4 accent-accent"> Poste
              </label>
              <label class="inline-flex min-h-11 cursor-pointer items-center gap-2">
                <input v-model="experienceEditor.item.type" type="radio" name="exp-type" value="education" class="size-4 accent-accent"> Formation
              </label>
            </div>
          </fieldset>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="exp-start" class="label">Début</label>
              <input id="exp-start" v-model="experienceEditor.item.startDate" class="field" required aria-describedby="exp-start-help">
              <p id="exp-start-help" class="help">ex. sept. 2023</p>
            </div>
            <div>
              <label for="exp-end" class="label">Fin <span class="font-normal text-muted">(facultatif)</span></label>
              <input id="exp-end" v-model="experienceEditor.item.endDate" class="field" aria-describedby="exp-end-help">
              <p id="exp-end-help" class="help">Laisser vide si en cours : affiché « aujourd'hui ».</p>
            </div>
          </div>
          <div>
            <label for="exp-description" class="label">Description <span class="font-normal text-muted">(facultatif)</span></label>
            <textarea id="exp-description" v-model="experienceEditor.item.description" rows="5" class="field"></textarea>
          </div>
        </div>
        <div class="space-y-3 border-t border-rule px-5 py-4">
          <ErrorBanner v-if="experienceEditor.error">{{ experienceEditor.error }}</ErrorBanner>
          <div class="flex justify-end gap-3">
            <button type="button" class="btn-secondary" @click="experienceEditor.requestClose()">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="experienceEditor.saving" :aria-busy="experienceEditor.saving">
              <SpinnerIcon v-if="experienceEditor.saving" />
              <template v-if="experienceEditor.saving">Enregistrement…</template>
              <template v-else>{{ experienceEditor.isNew ? RESOURCES.experiences.text.submitNew : 'Enregistrer' }}</template>
            </button>
          </div>
        </div>
      </form>
    </dialog>

    <ConfirmDialog
      ref="discardDialog"
      title="Abandonner les modifications ?"
      message="Ce que vous avez saisi sera perdu."
      cancel-label="Continuer l'édition"
      confirm-label="Abandonner"
      danger
      @confirm="confirmDiscard"
    />

    <ConfirmDialog
      ref="deleteDialog"
      :title="deleteText.deleteTitle"
      :message="deleteMessage || ''"
      :confirm-label="deleteText.deleteConfirm"
      busy-label="Suppression…"
      :busy="deleting"
      :error="deleteError"
      danger
      @confirm="confirmDelete"
    />

    <div role="status" aria-live="polite" class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6">
      <Transition
        enter-from-class="translate-y-2 opacity-0"
        enter-active-class="transition duration-base ease-enter"
        leave-active-class="transition-opacity duration-exit ease-exit"
        leave-to-class="opacity-0"
      >
        <p v-if="toast" class="flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-medium text-paper shadow-overlay">
          <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
          {{ toast }}
        </p>
      </Transition>
    </div>
  </div>
</template>
