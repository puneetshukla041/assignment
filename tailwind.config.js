/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: '#1e1e1e', // Deep dark background
          surface: '#252525', // Slightly lighter for panels/nodes
          border: '#333333', // Subtle borders
          text: '#dcddde', // Soft white text
          muted: '#8b8e90', // Muted text for relationships/labels
          accent: '#5c6bc0', // A soft, professional blue for active states
        }
      },
      boxShadow: {
        'node': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'node-active': '0 0 0 2px #5c6bc0, 0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}