/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                transparent: 'transparent',
                'var-white': '#ffffff',
                'var-black': '#191919',
                'var-bg':'#f7f4ed'
            },
            screens: {
                '3xl': '1800px', // Adding a custom screen size
            },
            fontFamily: {
                gama:["Wittgenstein", "system-ui","sans-serif"],
                display: ["system-ui", "sans-serif"],
                default: ["Noto Sans", "system-ui", "sans-serif"],
            },
            animation: {
                spinner: "spinner 1.2s linear infinite",
            },
            keyframes:{
                spinner: {
                    "0%": {
                        opacity: "1",
                    },
                    "100%": {
                        opacity: "0",
                    },
                },
            }
        },
    },
    plugins: [],
}