/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['index.html', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 6px 1px #FF6928',
        'glow-xl': '0 0 25px 7px #FF6928',
        violent: '4px 4px 0 0 #8d1eff',
        orange: '4px 4px 0 0 #ff8004',
        blue: '4px 4px 0 0 #1e90ff',
        dark: '4px 4px 0 0 #030408',
        danger: '4px 4px 0 0 #FE4756',
      },
      colors: {
        success: '#28CCAF',
        danger: '#FE4756',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        dark: '#030408',
        'light-blue': '#ECF7FD',
        blue: '#1e90ff',
        violent: '#8d1eff',
        'light-violent': '#f8f3ff',
        orange: '#ff8004',
        'light-orange': '#FDF2EC',
        background: '#FDF2EC',
        gray: '#9D9FC5',
        light: '#F9F9F9',
        'gray-blue': '#14141E',
        foreground: '#F9F9F9',
        primary: {
          DEFAULT: '#ff8004',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
