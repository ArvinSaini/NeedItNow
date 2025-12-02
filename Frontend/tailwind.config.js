/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#D34E4E',
          light: '#E87C7C',
          dark: '#B33E3E',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#E87C7C',
          600: '#D34E4E',
          700: '#B33E3E',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        secondary: {
          DEFAULT: '#F9E7B2',
          light: '#FFF5D6',
          dark: '#E6D49F',
          50: '#FFFEF7',
          100: '#FFF5D6',
          200: '#F9E7B2',
          300: '#F5DD9E',
          400: '#F0D389',
          500: '#E6D49F',
          600: '#D4B978',
          700: '#C29E51',
          800: '#9A7D41',
          900: '#725C31',
        },
        // Legacy coral support
        coral: {
          50: '#fff1f0',
          100: '#ffe1de',
          200: '#ffc7c2',
          300: '#ffa399',
          400: '#ff6f61',
          500: '#f85a4f',
          600: '#e53e3e',
          700: '#c62828',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'slide-in-down': 'slideInDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        blob: {
          '0%, 100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInUp: {
          from: {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideInDown: {
          from: {
            transform: 'translateY(-20px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        scaleIn: {
          from: {
            transform: 'scale(0.9)',
            opacity: '0',
          },
          to: {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },
      boxShadow: {
        'primary': '0 10px 40px -10px rgba(211, 78, 78, 0.3)',
        'primary-lg': '0 20px 60px -15px rgba(211, 78, 78, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
