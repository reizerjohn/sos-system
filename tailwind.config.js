/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin';
import colors from 'tailwindcss/colors';

export const content = [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
];

export const theme = {
  colors: {
    ...colors,
    'brand-color': '#650006',
  },
  extend: {
    fontFamily: {
      sans: ['var(--font-lato)'],
    },
  },
};

export const plugins = [
  require('@tailwindcss/typography'),
  plugin(({ addUtilities }) => {
    addUtilities({
      '.h1': { fontWeight: '700', fontSize: '72px', lineHeight: 1, letterSpacing: 0 },
      '.h2': { fontWeight: '700', fontSize: '60px', lineHeight: '64px', letterSpacing: 0 },
      '.h3': { fontWeight: '700', fontSize: '40px', lineHeight: '54px', letterSpacing: 0 },
      '.h4': { fontWeight: '700', fontSize: '30px', lineHeight: '40px', letterSpacing: 0 },
      '.h5': { fontWeight: '700', fontSize: '24px', lineHeight: '32px', letterSpacing: 0 },
      '.h6': { fontWeight: '700', fontSize: '18px', lineHeight: '30px', letterSpacing: 0 },
      '.h5-semibold': { fontWeight: '600', fontSize: '24px', lineHeight: '32px', letterSpacing: 0 },
      '.subheading-nav': { fontWeight: '300', fontSize: '13px', lineHeight: '20px', letterSpacing: 0 },
      '.subheading-lg': { fontWeight: '600', fontSize: '18px', lineHeight: '28px', letterSpacing: 0 },
      '.subheading-md': { fontWeight: '500', fontSize: '18px', lineHeight: '28px', letterSpacing: 0 },
      '.subheading': { fontWeight: '400', fontSize: '18px', lineHeight: '28px', letterSpacing: 0 },
      '.body-base': { fontWeight: '400', fontSize: '16px', lineHeight: '24px', letterSpacing: 0 },
      '.body-sm': { fontWeight: '400', fontSize: '14px', lineHeight: '20px', letterSpacing: 0 },
      '.body-xs': { fontWeight: '400', fontSize: '12px', lineHeight: '16px', letterSpacing: 0 },
      '.label-lg': { fontWeight: '600', fontSize: '16px', lineHeight: '24px', letterSpacing: 0 },
      '.label-md': { fontWeight: '500', fontSize: '14px', lineHeight: '20px', letterSpacing: 0 },
      '.label-small-medium': { fontWeight: '500', fontSize: '12px', lineHeight: '16px', letterSpacing: 0 },
      '.label-small-bold': { fontWeight: '600', fontSize: '12px', lineHeight: '16px', letterSpacing: 0 },
      '.btn-text-lg': { fontWeight: '500', fontSize: '16px', lineHeight: '24px' },
      '.btn-text-semibold': { fontWeight: '600', fontSize: '14px', lineHeight: '20px' },
      '.btn-text-base': { fonWeight: '500', fontSize: '14px', lineHeight: '20px' },
      '.btn-text-sm': { fontWeight: '500', fontSize: '14px', lineHeight: '16px' },
      '.btn-text-xs': { fontWeight: '500', fontSize: '12px', lineHeight: '16px' },
      '.btn-text-nav': { fontWeight: '400', fontSize: '10px', lineHeight: '16px' },
      '.sidebar-title': { fontWeight: '600', fontSize: '14px', lineHeight: '20px' },
      '.sidebar-link': { fontWeight: '400', fontSize: '14px', lineHeight: '16px' },
      '.notice-base': { fontWeight: '400', fontSize: '16px', lineHeight: '26px' },
    });
  })
];
