/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      './app/**/*.{js,ts,jsx,tsx}', // if using app directory
    ],
    theme: {
      extend: {
        colors: {
          primary: '#3E4A89',
          accent: '#65C9C2',
          background: '#F9FAFB',
          text: '#1F2937',
          success: '#10B981',
          warning: '#F59E0B',
        },
      },
    },
    plugins: [],
  }
  