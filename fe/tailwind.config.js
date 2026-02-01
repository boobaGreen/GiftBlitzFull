/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0B0E14',
                surface: '#151A23',
                primary: {
                    400: '#00f3ff', // Neon Cyan
                    500: '#00d4ff',
                    600: '#00a3cc',
                },
                secondary: {
                    400: '#d946ef', // Neon Purple
                    500: '#c026d3',
                    600: '#9333ea',
                },
                accent: {
                    green: '#00ff9d',
                    orange: '#ff9900',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'neon-cyan': '0 0 20px rgba(0, 243, 255, 0.3)',
                'neon-purple': '0 0 20px rgba(217, 70, 239, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'cyber-gradient': 'linear-gradient(135deg, #00f3ff 0%, #d946ef 100%)',
            }
        },
    },
    plugins: [],
}
