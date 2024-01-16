/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js' // configure the Flowbite JS source template paths
  ],
  theme: {
    flex: {
      1: '1',
      2: '2',
      3: '3',
      5: '5'
    },
    extend: {
      width: {
        '7/10': '70%',
        '90px': '90px'
      }
    }
  },
  plugins: [
    // eslint-disable-next-line  unicorn/prefer-module
    require('flowbite/plugin') // require Flowbite's plugin for Tailwind CSS
  ]
};
