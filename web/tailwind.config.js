/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    flex: {
      1: '1',
      2: '2',
      3: '3',
      5: '5'
    },
    extend: {}
  },
  plugins: []
};
