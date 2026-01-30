/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--color-background)',
        'background-soft': 'var(--color-background-soft)',
        'background-mute': 'var(--color-background-mute)',
        'heading': 'var(--color-heading)',
        'text': 'var(--color-text)',
        'accent': 'var(--color-accent)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
