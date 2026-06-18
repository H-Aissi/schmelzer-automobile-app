import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#8C2233',
          hover: '#731A29',
          700: '#731A29',
          soft: '#F6ECEE',
        },
        admin: '#14161B',
        canvas: '#F7F6F4',
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#FBFAF9',
          3: '#F1EFEC',
        },
        ink: {
          DEFAULT: '#1A1D24',
          2: '#4C525C',
          3: '#858B95',
        },
        line: {
          DEFAULT: '#E7E4DF',
          2: '#D9D5CE',
        },
        success: { DEFAULT: '#1E7A4D', light: '#E9F4EE' },
        warning: { DEFAULT: '#9A6516', light: '#FBF1DE' },
        danger: { DEFAULT: '#9A2233', light: '#F7E9EB' },
        info: { DEFAULT: '#2B5C9A', light: '#E9F0F8' },
      },
      fontFamily: {
        display: [
          'Saira Semi Condensed',
          'system-ui',
          'sans-serif',
        ],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        content: '1240px',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '18px',
        xl: '26px',
        pill: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(26,29,36,.05), 0 1px 1px rgba(26,29,36,.04)',
        md: '0 4px 16px rgba(26,29,36,.07), 0 1px 3px rgba(26,29,36,.05)',
        lg: '0 18px 48px rgba(26,29,36,.13), 0 4px 12px rgba(26,29,36,.07)',
      },
    },
  },
  plugins: [],
};

export default config;
