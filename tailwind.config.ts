import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'dramatic-zoom-in': 'dramatic-zoom-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'zoom-in': 'zoom-in 0.5s ease-out',
      },
      keyframes: {
        'dramatic-zoom-in': {
          '0%': { 
            transform: 'scale(0.2) rotate(-5deg)',
            opacity: '0',
            filter: 'blur(2px)'
          },
          '50%': {
            transform: 'scale(1.2) rotate(2deg)',
            opacity: '1',
            filter: 'blur(0px)'
          },
          '70%': {
            transform: 'scale(0.95)',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
          },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animationDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
}

export default config