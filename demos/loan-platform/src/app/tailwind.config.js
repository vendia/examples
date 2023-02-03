module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [require('daisyui')],
  daisyui: { themes: ['light', 'winter'] },
  theme: {
    extend: {
      fontFamily: {
        sans: ' "Open Sans", sans-serif;',
      },
    },
  },
};
