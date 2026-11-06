// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: set to the real domain before launch (used for canonical, hreflang and OG URLs)
  site: 'https://quadrocoffee.example',
  vite: {
    plugins: [tailwindcss()],
  },
});
