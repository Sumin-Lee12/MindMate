/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // 기존 정의
        background: '#f0f3ff',
        foreground: 'hsl(var(--foreground))',
        // 추가 색상 정의
        black: '#000000',
        gray: '#7d7d7d',
        white: '#ffffff',
        teal: '#c9efef',
        paleYellow: '#ffe5bc',
        pink: '#ffd7dd',
        turquoise: '#f0f3ff',
        foggyBlue: '#bdc7ff',
        paleCobalt: '#576bcd',
      },
      fontFamily: {
        pretendard: ['pretendard', 'System'],
      },
      fontSize: {
        ss: 16,
        sm: 18,
        md: 20,
        lg: 24,
        xl: 32,
      },
      boxShadow: {
        dropShadow: '0px 4px 6px rgba(189, 199, 255, 0.4)',
        dropShadowHard: '0px 4px 6px rgba(87, 107, 205, 0.6)',
      },
    },
  },
  plugins: [],
};
