/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#001E61',
        'navy-2': '#1E3A8A',
        'navy-3': '#3B82F6',
        'navy-4': '#9CA3AF',
        accent: '#D91414',
        cream: '#EBE8E5',
        'cream-border': '#D7D2CB',
        body: '#171612',
        muted: '#595959',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 22, 18, 0.04)',
      },
    },
  },
  plugins: [],
};
