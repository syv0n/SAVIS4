/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#93cb52', // Set your primary color
        navbar: '#333',
        green: '#93cb52',
      },
    },
  },
  plugins: [],  
}

