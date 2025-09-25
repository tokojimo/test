/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  safelist: [
    "grid-cols-1",
    "sm:grid-cols-2",
    "lg:grid-cols-3",
    "xl:grid-cols-4",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--forest-green))",
        "primary-foreground": "hsl(var(--paper-beige))",
        accent: "hsl(var(--accent))",
        forest: "hsl(var(--forest-green))",
        moss: "hsl(var(--moss-green))",
        fern: "hsl(var(--fern-green))",
        paper: "hsl(var(--paper-beige))",
        earth: "hsl(var(--earth-brown))",
        gold: "hsl(var(--accent-gold))",
        danger: "hsl(var(--danger))",
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        serif: ["'Merriweather'", "serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        'in-out': "var(--ease-in-out)",
      },
    },
  },
  plugins: [],
};
