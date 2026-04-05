/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: 'rgb(var(--dark-900) / <alpha-value>)',
          800: 'rgb(var(--dark-800) / <alpha-value>)',
          700: 'rgb(var(--dark-700) / <alpha-value>)',
          600: 'rgb(var(--dark-600) / <alpha-value>)',
          500: 'rgb(var(--dark-500) / <alpha-value>)',
        },
        accent: {
          purple: '#7c3aed',
          violet: '#8b5cf6',
          light: '#a78bfa',
        },
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'translateY(0)',  opacity: '0.4' },
          '40%':           { transform: 'translateY(-7px)', opacity: '1' },
        },
        glowFade: {
          '0%':   { boxShadow: '0 0 0 1.5px #7c3aed, 0 0 24px rgba(124,58,237,0.35)' },
          '60%':  { boxShadow: '0 0 0 1.5px #7c3aed, 0 0 24px rgba(124,58,237,0.15)' },
          '100%': { boxShadow: '0 0 0 0px transparent, 0 0 0px transparent' },
        },
        phraseIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '15%':  { opacity: '1', transform: 'translateY(0)' },
          '85%':  { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-6px)' },
        },
        underlineGrow: {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
        navShadowIn: {
          '0%':   { boxShadow: 'none' },
          '100%': { boxShadow: '0 4px 24px rgba(0,0,0,0.4)' },
        },
      },
      animation: {
        'fade-in-up':    'fadeInUp 0.45s ease-out both',
        'fade-in-down':  'fadeInDown 0.35s ease-out both',
        'float':         'float 3.5s ease-in-out infinite',
        'bounce-dot':    'bounceDot 1.3s ease-in-out infinite',
        'glow-fade':     'glowFade 3s ease-out forwards',
        'phrase-in':     'phraseIn 3s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
