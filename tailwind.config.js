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
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-geist-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#dbeafe',
          dark: '#1e40af'
        },
        background: {
          light: '#ffffff',
          'light-secondary': '#f8f9fa',
          dark: '#0d1117',
          'dark-secondary': '#161b22'
        },
        text: {
          light: '#1f2937',
          'light-secondary': '#6b7280',
          dark: '#e6edf3',
          'dark-secondary': '#8b949e'
        },
        border: {
          light: '#e5e7eb',
          'light-hover': '#d1d5db',
          dark: '#30363d',
          'dark-hover': '#484f58'
        },
        card: {
          light: '#ffffff',
          dark: '#161b22'
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b'
      }
    }
  },
  plugins: []
};
