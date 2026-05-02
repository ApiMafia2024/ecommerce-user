import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', "media"], // Use class-based dark mode instead of media query
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};

export default config;

