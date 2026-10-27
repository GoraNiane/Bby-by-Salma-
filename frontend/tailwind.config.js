/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bbs: {
          50: '#fdf8f6',
          100: '#fbf0eb',
          200: '#f6dfd5',
          300: '#ecc2b0',
          400: '#dc9d84',
          500: '#c87659',
          600: '#b85d43',
          700: '#994732',
          800: '#7e3a2a',
          900: '#3e2417',
          950: '#23120b',
        },
        gold: {
          50: '#fbf8ee',
          100: '#f5edd2',
          200: '#ebd7a1',
          300: '#dfbc6a',
          400: '#d5a542',
          500: '#be882e',
          600: '#a36d23',
          700: '#7f4e1d',
          800: '#673e1c',
          900: '#56341a',
        },
        nude: {
          light: '#fdfbf9',
          base: '#f7f2ef',
          warm: '#ede4de',
          card: '#ffffff',
          dark: '#2c1e18',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        script: ['"Alex Brush"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(62, 36, 23, 0.06)',
        'luxury': '0 20px 40px -15px rgba(62, 36, 23, 0.12)',
        'glow': '0 0 25px rgba(220, 157, 132, 0.35)',
      }
    },
  },
  plugins: [],
}
