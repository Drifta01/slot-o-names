/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        casino: {
          red: '#c41e3a',
          darkRed: '#8b1538',
          gold: '#ffd700',
          lightGold: '#ffed4e',
          dark: '#1a1a2e',
          purple: '#2c2c54',
        }
      },
      animation: {
        'glow': 'glow 2s infinite alternate',
        'machine-glow': 'machineGlow 3s ease-in-out infinite alternate',
        'jackpot-flash': 'jackpotFlash 1s infinite alternate',
        'blink': 'blink 1.5s infinite alternate',
        'bounce-custom': 'bounce 1s infinite',
        'result-appear': 'resultAppear 0.5s ease-out',
        'jackpot': 'jackpot 1s ease-in-out 5',
        'spin': 'spin 1s linear infinite',
        'slot-spin-fast': 'slotSpinFast 0.1s linear infinite',
        'slot-spin-slow': 'slotSpinSlow 0.3s linear infinite',
        'slot-blur': 'slotBlur 0.1s linear infinite',
        'reel-spin': 'reelSpin 0.15s linear infinite',
        'slot-lines': 'slotMachineLines 0.1s linear infinite',
        'scroll-lines': 'scrollLines 0.08s linear infinite',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 5px #ffd700' },
          'to': { boxShadow: '0 0 20px #ffd700, 0 0 30px #ffd700' },
        },
        machineGlow: {
          'from': { boxShadow: '0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1), 0 0 60px rgba(196, 30, 58, 0.3)' },
          'to': { boxShadow: '0 0 40px rgba(0, 0, 0, 0.7), inset 0 0 30px rgba(255, 255, 255, 0.2), 0 0 80px rgba(255, 215, 0, 0.4)' },
        },
        jackpotFlash: {
          'from': { opacity: '0.7' },
          'to': { opacity: '1' },
        },
        blink: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
        resultAppear: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        jackpot: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        spin: {
          'from': { transform: 'translateY(0)' },
          'to': { transform: 'translateY(-100%)' },
        },
        slotSpinFast: {
          '0%': { transform: 'translateY(0%)', filter: 'blur(2px)' },
          '100%': { transform: 'translateY(-300%)', filter: 'blur(2px)' },
        },
        slotSpinSlow: {
          '0%': { transform: 'translateY(0%)', filter: 'blur(1px)' },
          '100%': { transform: 'translateY(-200%)', filter: 'blur(1px)' },
        },
        slotBlur: {
          '0%, 100%': { filter: 'blur(0px)' },
          '50%': { filter: 'blur(3px)' },
        },
        reelSpin: {
          '0%': { transform: 'translateY(0px)', opacity: '1' },
          '25%': { transform: 'translateY(-20px)', opacity: '0.8' },
          '50%': { transform: 'translateY(-40px)', opacity: '0.6' },
          '75%': { transform: 'translateY(-20px)', opacity: '0.8' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        slotMachineLines: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        scrollLines: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100px' },
        },
      },
    },
  },
  plugins: [],
}
