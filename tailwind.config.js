/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./nuxt.config.{js,ts}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--accent-primary-rgb) / <alpha-value>)',
          light: 'rgb(var(--accent-primary-rgb) / 0.1)',
        },
        success: {
          DEFAULT: 'rgb(var(--accent-success-rgb) / <alpha-value>)',
          light: 'rgb(var(--accent-success-rgb) / 0.1)',
        },
        danger: {
          DEFAULT: 'rgb(var(--accent-danger-rgb) / <alpha-value>)',
          light: 'rgb(var(--accent-danger-rgb) / 0.1)',
        },
        warning: {
          DEFAULT: 'rgb(var(--accent-warning-rgb) / <alpha-value>)',
          light: 'rgb(var(--accent-warning-rgb) / 0.1)',
        },
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'border-color': 'var(--border-color)',
      },
    },
  },
  plugins: [],
}
