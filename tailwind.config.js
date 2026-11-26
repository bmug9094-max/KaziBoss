/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        line: token('line'),
        ink: token('ink'),
        muted: token('muted'),
        gold: { DEFAULT: '#F59E0B', soft: '#FBBF24', deep: '#B45309' },
        emerald: { DEFAULT: '#10B981', soft: '#34D399', deep: '#047857' },
        coral: { DEFAULT: '#EF4444', soft: '#F87171', deep: '#B91C1C' },
        sky: { DEFAULT: '#38BDF8', deep: '#0369A1' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
      },
      // `short:` = écrans peu hauts (petits Android, iPhone SE, navigateur avec barre d'adresse) :
      // on compacte l'écran de jeu pour que les boutons de choix restent visibles sans défiler.
      screens: {
        short: { raw: '(max-height: 760px)' },
        tiny: { raw: '(max-height: 640px)' },
      },
      boxShadow: {
        card: '0 10px 30px -12px rgb(0 0 0 / 0.45)',
        glow: '0 0 0 4px rgb(245 158 11 / 0.18)',
      },
    },
  },
  plugins: [],
};
