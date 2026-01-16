/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'SFMono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace']
      },
      colors: {
        border: 'hsl(214, 9%, 86%)',
        muted: '#f6f8fa',
        mutedDark: '#0d1117',
        surface: '#ffffff',
        surfaceDark: '#0c1117',
        accent: '#0969da',
        success: '#2da44e',
        danger: '#cf222e'
      }
    }
  },
  plugins: []
};
