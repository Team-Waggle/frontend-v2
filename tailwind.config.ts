import type { Config } from 'tailwindcss';
import scrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#0066FF',
          5: '#F0F6FF',
          10: '#DCEAFF',
          20: '#CBE0FF',
          30: '#B8D5FF',
          40: '#94BFFF',
          50: '#6CA7FF',
          60: '#4E95FF',
          70: '#237BFF',
          80: '#0066FF',
          90: '#0040A1',
          100: '#023075',
        },
        black: {
          DEFAULT: '#0E0E0F',
          5: '#FFFFFF',
          10: '#F2F3F4',
          20: '#E7E8EA',
          30: '#CFD1D5',
          40: '#B7B9C0',
          50: '#9FA2AB',
          60: '#878B96',
          70: '#6C6F78',
          80: '#51535A',
          90: '#36383C',
          100: '#0E0E0F',
        },
        hover: {
          5: '#F2F2F2',
          10: '#E6E7E8',
          80: '#0057D9',
        },
        error: { DEFAULT: '#F5552D' },
      },
      boxShadow: {
        'main-card': '0 0 36px 0 rgba(0, 0, 0, 0.15)',
        'search-select-box':
          '0 2px 16.6px 0 rgba(0, 0, 0, 0.15), 0 1px 4px 0 rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'team-home-left-slide-background':
          'linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #FFF 100%)',
        'team-home-right-slide-background':
          'linear-gradient(270deg, #FFF 0%, rgba(255, 255, 255, 0) 100%)',
      },
      screens: {
        'max-1440': { max: '1440px' },
      },
    },
  },
  plugins: [scrollbarHide],
} satisfies Config;
