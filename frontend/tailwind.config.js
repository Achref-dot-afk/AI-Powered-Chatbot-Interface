/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        // Existing animations
        'slide-up': 'slideUp 0.8s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-delay': 'fadeIn 0.8s ease-out 0.2s both',
        'slide-up-delay': 'slideUp 0.6s ease-out 0.4s both',
        'slide-up-delay-2': 'slideUp 0.6s ease-out 0.5s both',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 4s ease-in-out 1s infinite',
        
        // New enhanced animations
        'float-chat': 'floatChat 5s ease-in-out infinite',
        'float-chat-delayed': 'floatChat 5s ease-in-out 2s infinite',
        'float-icon': 'floatIcon 8s ease-in-out infinite',
        'float-icon-delayed': 'floatIcon 8s ease-in-out 3s infinite',
        'float-icon-slower': 'floatIcon 10s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'bounce-slower': 'bounce 4s infinite',
        'bounce-delayed': 'bounce 3s infinite 1s',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'pulse-slower': 'pulse 6s infinite',
        'pulse-delayed': 'pulse 4s infinite 2s',
        'pulse-soft': 'pulseSoft 2s infinite',
        'wiggle': 'wiggle 2s infinite',
        'wiggle-hover': 'wiggle 1s ease-in-out',
        'wave': 'wave 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'rotate-slow': 'rotate 4s linear infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(50px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg)' 
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(5deg)' 
          },
        },
        floatChat: {
          '0%, 100%': { 
            transform: 'translateY(0) translateX(0) scale(1)' 
          },
          '25%': { 
            transform: 'translateY(-15px) translateX(5px) scale(1.05)' 
          },
          '50%': { 
            transform: 'translateY(-10px) translateX(-5px) scale(1.02)' 
          },
          '75%': { 
            transform: 'translateY(-20px) translateX(3px) scale(1.03)' 
          },
        },
        floatIcon: {
          '0%, 100%': { 
            transform: 'translateY(0) translateX(0) rotate(0deg) scale(1)' 
          },
          '33%': { 
            transform: 'translateY(-25px) translateX(10px) rotate(10deg) scale(1.1)' 
          },
          '66%': { 
            transform: 'translateY(-15px) translateX(-8px) rotate(-5deg) scale(1.05)' 
          },
        },
        bounceSoft: {
          '0%, 100%': { 
            transform: 'translateY(0)' 
          },
          '50%': { 
            transform: 'translateY(-3px)' 
          },
        },
        pulseSoft: {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)' 
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)' 
          },
        },
        wiggle: {
          '0%, 100%': { 
            transform: 'rotate(-3deg)' 
          },
          '50%': { 
            transform: 'rotate(3deg)' 
          },
        },
        wave: {
          '0%': { 
            transform: 'rotate(0deg)' 
          },
          '10%': { 
            transform: 'rotate(14deg)' 
          },
          '20%': { 
            transform: 'rotate(-8deg)' 
          },
          '30%': { 
            transform: 'rotate(14deg)' 
          },
          '40%': { 
            transform: 'rotate(-4deg)' 
          },
          '50%': { 
            transform: 'rotate(10deg)' 
          },
          '60%': { 
            transform: 'rotate(0deg)' 
          },
          '100%': { 
            transform: 'rotate(0deg)' 
          },
        },
        rotate: {
          '0%': { 
            transform: 'rotate(0deg)' 
          },
          '100%': { 
            transform: 'rotate(360deg)' 
          },
        },
        sparkle: {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)' 
          },
          '50%': { 
            opacity: '0.7',
            transform: 'scale(1.2)' 
          },
        },
      },
    },
  },
  plugins: [],
}