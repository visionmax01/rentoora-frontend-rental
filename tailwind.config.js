/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Rampart: ["Rampart One", "cursive"],
        LogoText: ["Playwrite BE VLG", "cursive"],
        Roboto: ["Oswald"],
      },
      keyframes: {
        'fill-bottom-right': {
          '0%': { transform: 'scale(0) translateY(0)', transformOrigin: 'bottom right', opacity: 1 },
          '100%': { transform: 'scale(1) translateY(0)', transformOrigin: 'bottom right', opacity: 1 },
        },
      },
      animation: {
        'fill-bottom-right': 'fill-bottom-right 0.4s ease-in-out forwards',
      },
      textShadow: {
        'sm': '1px 1px 2px rgba(0, 0, 0, 0.5)',
        'md': '2px 2px 4px rgba(0, 0, 0, 0.5)',
        'lg': '3px 3px 6px rgba(0, 0, 0, 0.5)',
        'xl': '4px 4px 8px rgba(0, 0, 0, 0.5)',
        '2xl': '5px 5px 10px rgba(0, 0, 0, 0.5)',
      },
      colors: {
        brand: {
          light: '#2B6995',
          lightGrow: "#3F83B4",
          lightdark: "#357BAD",
          DEFAULT: '#ffffff',
          dark: '#0056b3',
          input: '#F3F1FF',
          Colorpurple: '#774FB8',
          bodyColor: '#C9CBEA',
          navbg: '#4B4444',
          bgColor:'#180f27',
          white:"#FFFFFF",
          Black: '#000000'
        },
        secondary: {
          light: '#FFBB3A',
          DEFAULT: '#FF9800',
          dark: '#FF7200',
          green:"#0a5d00"
        },
      },
      boxShadow: {
        'custom-hover': '0 4px 10px 0 rgba(0, 0, 0, 0.25), 0 4px 20px 0 rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gradient-hover': 'linear-gradient(45deg, rgba(255, 0, 150, 0.3) 0%, rgba(0, 204, 255, 0.3) 50%, rgba(51, 102, 255, 0.3) 100%)',
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ['hover'],
      backgroundImage: ['hover'],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
        },
        '.text-shadow-md': {
          textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 0px 10px  #ffffff',
        },
        '.text-shadow-xl': {
          textShadow: '4px 4px 8px rgba(255, 255, 255, 0.5)',
        },
        '.text-shadow-2xl': {
          textShadow: '5px 5px 10px rgba(255, 255, 255, 0.5)',
        },
      });
    },
  ],
}
