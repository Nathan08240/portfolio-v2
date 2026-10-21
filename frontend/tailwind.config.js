/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        ink: { DEFAULT: 'var(--ink)', soft: 'var(--ink-soft)' },
        muted: 'var(--muted)',
        rule: { DEFAULT: 'var(--rule)', strong: 'var(--rule-strong)' },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          tint: 'var(--accent-tint)',
          on: 'var(--on-accent)',
        },
        danger: { DEFAULT: 'var(--danger)', tint: 'var(--danger-tint)', on: 'var(--on-danger)' },
        success: 'var(--success)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      fontSize: {
        display: ['clamp(2.75rem, 1.5rem + 6.5vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'hero-title': ['clamp(1.375rem, 1rem + 1.6vw, 2.25rem)', { lineHeight: '1.15' }],
        email: ['clamp(1.375rem, 0.9rem + 3vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        section: ['1.75rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        h3: ['1.375rem', { lineHeight: '1.25' }],
        lead: ['1.25rem', { lineHeight: '1.5' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        meta: ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
      },
      boxShadow: {
        overlay: '0 1px 2px rgb(0 0 0 / 0.06), 0 12px 32px -8px rgb(0 0 0 / 0.22)',
      },
      transitionDuration: { fast: '120ms', base: '200ms', exit: '140ms' },
      transitionTimingFunction: {
        enter: 'cubic-bezier(.2,.7,.2,1)',
        exit: 'cubic-bezier(.4,0,1,1)',
      },
    },
  },
  plugins: [],
}
