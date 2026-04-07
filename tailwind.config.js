/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        dark: {
          100: '#1a1a2e',
          200: '#252542',
          300: '#2a2a4a',
          400: '#3a3a5a',
          500: '#4a4a6a',
        },
        accent: {
          yellow: '#fbbf24',
          green: '#50fa7b',
        }
      },
    },
  },
  plugins: [],
};
