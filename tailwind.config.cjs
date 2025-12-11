/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            // Optional: Customizing the typography styles
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '100%',
                        h1: { color: '#2563eb', fontWeight: '800' }, // Blue headings
                        a: { color: '#3b82f6', '&:hover': { color: '#1d4ed8' } },
                        pre: { backgroundColor: 'transparent', padding: 0 }, // Let our custom component handle code blocks
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
