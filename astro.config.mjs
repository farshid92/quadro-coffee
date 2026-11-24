// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // The site's public address (used for canonical, hreflang, sitemap and link-preview URLs).
  // TODO: change to https://quadrocoffee.com once the domain is bought and connected in Cloudflare.
  site: 'https://quadro-coffee.farshidcheraghchian.workers.dev',
  // The site's CSS is small, so put it in the page instead of a separate file: the page can paint sooner
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
});
