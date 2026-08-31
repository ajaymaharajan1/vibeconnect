/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vibe: {
          primary: '#6366f1',
          accent: '#ec4899',
          purple: '#8b5cf6',
          dark: '#0f172a',
          light: '#f8fafc',
          green: '#22c55e'
        }
      }
    },
  },
  plugins: [],
}
