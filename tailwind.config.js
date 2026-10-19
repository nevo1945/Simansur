/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A3A5C',
          hover: '#132c47',
          light: '#244e7c',
          50: '#f0f5fa',
          100: '#e1ecf5',
          500: '#1A3A5C',
          600: '#16314f',
          700: '#12273e',
        },
        secondary: {
          DEFAULT: '#2E5C8A',
          hover: '#254b70',
          light: '#3b73ac',
          50: '#f2f7fc',
        },
        accent: {
          DEFAULT: '#F5A623',
          hover: '#d99017',
          light: '#f7b64a',
          50: '#fef9f0',
        },
        gov: {
          bg: '#F5F7FA',
          card: '#FFFFFF',
          border: '#E5E7EB',
          text: '#1F2937',
          muted: '#6B7280',
          dark: '#0f172a',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#2E5C8A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
        'input': '6px',
      },
      boxShadow: {
        'gov': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'gov-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'gov-modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
