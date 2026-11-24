/**
 * tailwind-apple.js — Tailwind preset mirroring the Apple design tokens.
 *
 * Usage (tailwind.config.js):
 *   module.exports = { presets: [require('./assets/tailwind-apple.js')], content: [...] }
 * or ESM: import apple from './assets/tailwind-apple.js'
 *
 * Tokens come from assets/apple.css (measured on apple.com.cn/store).
 * Rule of thumb: after adopting this preset, delete every default gray-*, slate-*,
 * blue-*, and rounded-lg/xl/2xl/3xl usage — the scales below are the only allowed steps.
 */

const colors = {
  ink: {
    DEFAULT: '#1d1d1f',
    80: 'rgba(0,0,0,0.8)',
    72: 'rgba(0,0,0,0.72)',
    56: 'rgba(0,0,0,0.56)',
    48: 'rgba(0,0,0,0.48)',
  },
  gray: {
    DEFAULT: '#6e6e73',
    3: '#86868b',
    4: '#a1a1a6',
  },
  hairline: { DEFAULT: '#d2d2d7', strong: '#b8b8bd' },
  surface: { DEFAULT: '#f5f5f7', 2: '#e8e8ed', canvas: '#ffffff' },
  blue: { DEFAULT: '#0071e3', hover: '#0076df', active: '#006edb', dark: '#2997ff' },
  link: '#06c',
  danger: '#e30000',
  success: '#068a3c',
  nav: { DEFAULT: 'rgba(250,250,252,0.8)', solid: 'rgba(250,250,252,0.92)', border: 'rgba(0,0,0,0.08)' },
};

const fontFamily = {
  display: ['"SF Pro Display"', '"SF Pro Icons"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
  text: ['"SF Pro Text"', '"SF Pro Icons"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
  mono: ['"SF Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
};

const fontSize = {
  'display-xl': ['80px', { lineHeight: '1.05', letterSpacing: '-0.015em', fontWeight: '600' }],
  display: ['64px', { lineHeight: '1.07', letterSpacing: '-0.015em', fontWeight: '600' }],
  'title-1': ['48px', { lineHeight: '1.08', letterSpacing: '-0.009em', fontWeight: '600' }],
  'title-2': ['40px', { lineHeight: '1.1', letterSpacing: '-0.009em', fontWeight: '600' }],
  'title-3': ['32px', { lineHeight: '1.15', letterSpacing: '-0.006em', fontWeight: '600' }],
  'title-4': ['24px', { lineHeight: '1.2', letterSpacing: '-0.003em', fontWeight: '600' }],
  'body-lg': ['19px', { lineHeight: '1.42', letterSpacing: '0.007em' }],
  body: ['17px', { lineHeight: '1.47', letterSpacing: '-0.022em' }],
  'body-sm': ['14px', { lineHeight: '1.43', letterSpacing: '-0.016em' }],
  caption: ['12px', { lineHeight: '1.33', letterSpacing: '-0.01em' }],
  footnote: ['10px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
};

const borderRadius = {
  none: '0',
  xs: '5px',
  sm: '8px',
  DEFAULT: '12px',
  md: '12px',
  lg: '18px',
  xl: '28px',
  pill: '980px',
};

const boxShadow = {
  'ap-1': '0 1px 2px rgba(0,0,0,0.04)',
  'ap-2': '0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)',
  'ap-3': '0 8px 24px rgba(0,0,0,0.10)',
  'ap-4': '0 16px 48px rgba(0,0,0,0.14)',
  DEFAULT: '0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)',
};

const spacing = {
  s1: '4px', s2: '8px', s3: '12px', s4: '16px', s5: '20px', s6: '24px',
  s8: '32px', s10: '40px', s12: '48px', s14: '56px', s16: '64px',
  s20: '80px', s24: '96px',
  section: '76px',
  gutter: '24px',
  nav: '44px',
  'nav-lg': '48px',
};

const screens = { '2xl': '1680px', xl: '1440px', lg: '1068px', md: '734px', sm: '480px' };

const transitionTimingFunction = {
  apple: 'cubic-bezier(0.4,0,0.6,1)',
  'apple-out': 'cubic-bezier(0,0,0.58,1)',
};

const transitionDuration = { fast: '160ms', DEFAULT: '240ms', slow: '400ms' };

const maxWidth = {
  wide: '1440px',
  text: '980px',
  prose: '816px',
  nav: '1024px',
  hero: '1000px',
};

const backdropBlur = { nav: '20px' };

module.exports = {
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize,
      borderRadius,
      boxShadow,
      spacing,
      screens,
      maxWidth,
      transitionTimingFunction,
      transitionDuration,
      backdropBlur,
      backdropSaturate: { nav: '180%' },
      opacity: { disabled: '0.42' },
    },
  },
};
