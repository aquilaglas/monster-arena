/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        accent: '#ffe66d',
        dark: '#2d3436',
        light: '#dfe6e9'
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'cursive']
      }
    }
  },
  plugins: []
};
