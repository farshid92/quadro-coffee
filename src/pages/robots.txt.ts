// robots.txt: everything may be crawled except the content editor (/admin/); points search engines to the sitemap.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap.xml', site ?? 'https://quadrocoffee.example').href;
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${sitemap}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
