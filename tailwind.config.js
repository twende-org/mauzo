/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {
       colors: {
      primary: '#20B2AA',
    },
     fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
       animation: {
      'slide-down': 'slide-down 0.3s ease-out',
    },
    },
  },
  plugins: [],
}

