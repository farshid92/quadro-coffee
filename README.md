# Quadro Coffee website

One-page, bilingual website for Quadro Coffee, a café in Köşklüçiftlik, Lefkoşa (Nicosia). Turkish at `/`, English at `/en/`.

On desktop the site is a set of full-screen panels that you step through with a curved wipe, opening with a "diamond window" intro based on the logo. Phones, tablets and visitors who prefer reduced motion get a normal scrolling page.

**Built with** [Astro](https://astro.build), TypeScript and [Tailwind CSS](https://tailwindcss.com). No paid dependencies and no tracking scripts.

## Getting started

Requires Node.js 22.23.4 or newer (Astro's minimum).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve the built site locally
```

## Where things live

| What | Where |
|---|---|
| All visible text (Turkish / English) | `content/tr/site.json`, `content/en/site.json` |
| Phone, address, opening hours, links | `src/lib/business.ts` |
| Brand colours and fonts | `brand.json`, mirrored in `src/styles/global.css` |
| Photos | `src/assets/images/` (referenced by file name from the content files) |
| Page sections | `src/components/` (each section is a `Panel`) |
| Desktop panel navigation and curved wipe | `src/scripts/deck.ts` |
| Project brief and open items | `brief.md` |

Every text change has to be made in both language files.

## Deploying

The build output is a static folder, so any static host works. On Cloudflare Pages: build command `npm run build`, output directory `dist`.

## Status

Demo / portfolio version. Several photos are temporary placeholders (some AI-generated) and will be replaced with real photos of the café before launch. See the open items in `brief.md`.
