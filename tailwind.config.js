/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Saree-inspired elegant palette
                primary: {
                    50: '#fef9ed',
                    100: '#fcefd4',
                    200: '#f8dea8',
                    300: '#f4c671',
                    400: '#efa841',
                    500: '#d4af37', // Main gold
                    600: '#b8901e',
                    700: '#956d19',
                    800: '#7a571a',
                    900: '#67491a',
                },
                secondary: {
                    50: '#faf5f9',
                    100: '#f5ebf3',
                    200: '#edd8e9',
                    300: '#deb9d7',
                    400: '#c98fbd',
                    500: '#b368a2',
                    600: '#964e83',
                    700: '#7a3e6a',
                    800: '#653658',
                    900: '#4a1e3e', // Deep velvet
                },
                cream: {
                    50: '#fefdfb',
                    100: '#fdfcf9',
                    200: '#faf9f6', // Soft cream
                    300: '#f5f4f1',
                    400: '#edeae5',
                    500: '#e4e0d9',
                    600: '#d1cdc4',
                    700: '#b8b4ab',
                    800: '#9d9990',
                    900: '#7d7a72',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            },
        },
    },
    plugins: [],
}
