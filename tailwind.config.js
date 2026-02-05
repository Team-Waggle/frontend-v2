/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "main-card": "0 0 36px 0 rgba(0, 0, 0, 0.15)",
        "search-select-box": "0 2px 16.6px 0 rgba(0, 0, 0, 0.15), 0 1px 4px 0 rgba(0, 0, 0, 0.08)"
      },
    },
  },
  plugins: [],
};
