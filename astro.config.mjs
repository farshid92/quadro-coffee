// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: set to the real domain before launch (used for canonical, hreflang and OG URLs)
  site: 'https://quadrocoffee.example',
  // The site's CSS is small, so put it in the page instead of a separate file: the page can paint sooner
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
});
