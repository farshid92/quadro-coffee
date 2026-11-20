// sitemap.xml: both language versions of each page (home, menu), linked to each other for Google.
import type { APIRoute } from 'astro';
import { homePath, menuPath, type Lang } from '../lib/i18n';

const pages: ((lang: Lang) => string)[] = [homePath, menuPath];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://quadrocoffee.example');
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.flatMap((path) => {
    const tr = new URL(path('tr'), base).href;
    const en = new URL(path('en'), base).href;
    const alternates = `<xhtml:link rel="alternate" hreflang="tr" href="${tr}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${tr}"/>`;
    return [tr, en].map((loc) => `<url><loc>${loc}</loc><lastmod>${today}</lastmod>${alternates}</url>`);
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
