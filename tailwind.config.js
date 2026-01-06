/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sathy-blue': '#1E3A8A',  // Sathyabama blue
      },
      backgroundImage: {
        // Ensure the image is in public folder
        'custom-bg': "url('/sathyabama.png')",
      },
    },
  },
  plugins: [],
}
