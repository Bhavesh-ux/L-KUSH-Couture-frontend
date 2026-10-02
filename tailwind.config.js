/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0c0c0e',
          charcoal: '#15151a',
          dark: '#1e1e24',
          card: '#1a1a20',
          border: '#2a2a35',
          gold: {
            50: '#fcf9ee',
            100: '#f7f1d4',
            200: '#ede0a5',
            300: '#e1cb70',
            400: '#d5b546',
            500: '#c5a059', // Primary L-KUSH Gold
            600: '#ad8442',
            700: '#896434',
            800: '#6f4f2c',
            900: '#5c4127',
            accent: '#e6c875',
          },
          cream: {
            50: '#fdfcf9',
            100: '#fbf8f2',
            200: '#f5efe3',
            300: '#ede2ce',
            400: '#dec9aa',
            500: '#caa983',
          },
          ivory: '#faf8f5',
          sand: '#efece5',
          taupe: '#8b8478',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(197, 160, 89, 0.25)',
        'gold-subtle': '0 4px 20px -2px rgba(197, 160, 89, 0.15)',
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.12)',
        'luxury-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #d5b546 0%, #c5a059 50%, #9e7935 100%)',
        'gradient-dark': 'linear-gradient(180deg, #15151a 0%, #0c0c0e 100%)',
      }
    },
  },
  plugins: [],
}
