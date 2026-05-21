/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#edfaf7',
          100: '#c8f1e8',
          200: '#94e4d4',
          300: '#55cfba',
          400: '#28b59d',
          500: '#0e9b84',
          600: '#077d6b',
          700: '#076457',
          800: '#074f45',
          900: '#063d36',
        },
        crystal: {
          50:  '#f0fdfb',
          100: '#ccfaf2',
          200: '#99f3e6',
          300: '#5ee8d5',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
        display: ['"Sora"', 'ui-sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(14,155,132,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'card': '0 2px 12px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
