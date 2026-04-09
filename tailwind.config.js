/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: '#301011',
        'steel-blue': '#507998',
        'off-white': '#F8F6F3',
        gold: '#C4A882',
        'warm-brown': '#714424',
        tan: '#986F50',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
