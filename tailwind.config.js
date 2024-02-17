/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      backgroundColor: {
        'nav-gray': '#161616',
        'background-gray': '#0d0d0d',
        'divider': '#333333',
        'primary': '#dff976',
      },
      backgroundImage: {
        'loading': "url('/src/assets/images/loading.png')",
      }
    },
  },
  plugins: [],
}