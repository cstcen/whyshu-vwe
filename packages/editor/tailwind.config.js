/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        editor: {
          bg: '#1e1e2e',
          panel: '#2a2a3e',
          border: '#3a3a5c',
          accent: '#7c6af5',
          hover: '#3a3a5c',
          selected: '#7c6af540',
        },
      },
    },
  },
  plugins: [],
}
