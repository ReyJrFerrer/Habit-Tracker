/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glass': {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        'bg-base': '#302d2d',
        'bg-gradient-start': '#302d2d',
        'bg-gradient-end': '#1a1a1a',
        'accent-primary': '#a78bfa',
        'accent-success': '#34d399',
        'accent-warning': '#fbbf24',
        'text-primary': '#f9fafb',
        'text-secondary': 'rgba(249, 250, 251, 0.7)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
