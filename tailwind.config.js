/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // 기존 정의
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // 추가 색상 정의
        black: 'var(--color-black)',
        gray: 'var(--color-gray)',
        white: 'var(--color-white)',
        teal: 'var(--color-teal)',
        paleYellow: 'var(--color-paleYellow)',
        pink: 'var(--color-pink)',
        turquoise: 'var(--color-turquoise)',
        foggyBlue: 'var(--color-foggyBlue)',
        paleCobalt: 'var(--color-paleCobalt)',
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
    },
  },
  plugins: [],
};
