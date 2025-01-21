/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: '#FEFEFE',
        foreground: '#323232',
        primary: '#4CAF50',
        secondary: '#1B2956',
        card: {
          DEFAULT: '#FEFEFE',
          foreground: '#323232',
        },
        popover: {
          DEFAULT: '#FEFEFE',
          foreground: '#323232',
        },
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#666666',
        },
        accent: {
          DEFAULT: '#323232',
          foreground: '#FEFEFE',
        },
        destructive: {
          DEFAULT: '#FF4444',
          foreground: '#FEFEFE',
        },
        border: '#E5E5E5',
        input: '#F5F5F5',
        ring: '#4CAF50',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};