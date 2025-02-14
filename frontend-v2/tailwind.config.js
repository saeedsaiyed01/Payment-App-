/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
       
        blue:{
          200:"#E9F5F7",
          400:"#98dff6",
        },
        purple:{
          200:"#F0F6F5",
          600: '#14adff',
          400:'#a1e8ff' ,//secondary
          200:'#1cafff'// Your custom color instead of Tailwind's default blue-600
        }
      },
    },
  },
  plugins: [],
}

