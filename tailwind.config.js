/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jazz: {
          bg: '#0d0d0f',
          surface: '#1a1a1f',
          card: '#22222a',
          border: '#2e2e3a',
          accent: '#c9a84c',
          blue: '#4a9eff',
          green: '#4aff8a',
          red: '#ff5566',
          muted: '#6b7280',
        }
      },
    },
  },
  plugins: [],
}

