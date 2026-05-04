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
        orange: { DEFAULT: '#FE991D', 2: '#FFF5E9' },
        error: { DEFAULT: '#F5552D', 2: '#FFEEEA' },
        temperatureBg: {
          coral: '#F5552D',
          coral2: '#FFEEEA',
          gray: '#9FA2AB',
          gray2: '#E7E8EA',
          orange: '#FE991D',
          orange2: '#FFF5E9',
        },
        temperatureFont: {
          gray: '#0E0E0F',
          orange: '#FE991D',
          coral: '#F5552D',
        },
      },
      boxShadow: {
        'main-card': '0 0 36px 0 rgba(0, 0, 0, 0.15)',
        'search-select-box':
          '0 2px 16.6px 0 rgba(0, 0, 0, 0.15), 0 1px 4px 0 rgba(0, 0, 0, 0.08)',
        'profile-img': 'inset 0 0 0 1px rgba(14, 14, 15, 0.10)',
        'applicants-card':
          '0px 1px 4px 0px rgba(0, 0, 0, 0.08), 0px 2px 18px 0px rgba(0, 0, 0, 0.08)',
        'message-btn':
          '0 6px 12px 0 rgba(0, 0, 0, 0.12), 0 4px 8px 0 rgba(0, 0, 0, 0.08), 0 0 4px 0 rgba(0, 0, 0, 0.08)',
        'chat-input-box': '0 -2px 10px 0 rgba(0, 0, 0, 0.10)',
      },
      backgroundImage: {
        'team-home-left-slide-background':
          'linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #FFF 100%)',
        'team-home-right-slide-background':
          'linear-gradient(270deg, #FFF 0%, rgba(255, 255, 255, 0) 100%)',
      },
      screens: {
        wide: '1040px',
        '3xl': '1920px',
        'max-1440': { max: '1440px' },
      },
    },
  },
  plugins: [scrollbarHide],
} satisfies Config;
