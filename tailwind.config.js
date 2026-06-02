/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#F8F9FC",
        sidebar: "#0F172A",
        accent: "#6366F1",
        card: "#FFFFFF",
        "border-light": "#E8EDF2",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        serif: ['"Lora"', "serif"],
      },
      borderRadius: {
        card: "10px",
        button: "6px",
        badge: "20px",
      },
      boxShadow: {
        soft: "0 1px 4px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
