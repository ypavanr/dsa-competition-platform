/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  
  ],
  theme: {
    extend: {
      dropShadow: {
        '3d': [
          '2px 2px 0px rgba(255,255,255,0.7)',
          '4px 4px 0px rgba(0,0,0,0.3)',
        ],
      },
    },
  },
  plugins: [],
}
