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
        newGreen: '#93cb52',
        lightMintGreen: '#E7F3E5',
        darkMintGreen: '#D5EDD0', 
        greenBar: '#D0E4C0',
        lightGray: '#D6DCD5',
        darkGray: '#B5BAB5',
      },
    },
  },
  plugins: [],  
}

