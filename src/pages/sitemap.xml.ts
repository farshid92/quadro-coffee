// sitemap.xml: both language versions of the home page, linked to each other for Google.
import type { APIRoute } from 'astro';
import { homePath } from '../lib/i18n';

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://quadrocoffee.example');
  const tr = new URL(homePath('tr'), base).href;
  const en = new URL(homePath('en'), base).href;
  const today = new Date().toISOString().slice(0, 10);
  const alternates = `<xhtml:link rel="alternate" hreflang="tr" href="${tr}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${tr}"/>`;
  const url = (loc: string) => `<url><loc>${loc}</loc><lastmod>${today}</lastmod>${alternates}</url>`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${url(tr)}
${url(en)}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
