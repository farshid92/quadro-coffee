# Quadro Coffee website

Bilingual website for Quadro Coffee, a café in Köşklüçiftlik, Lefkoşa (Nicosia). Turkish at `/`, English at `/en/`.

| Page | Turkish | English |
|---|---|---|
| Home (one page with all sections) | `/` | `/en/` |
| Full menu (searchable, easy to share) | `/menu/` | `/en/menu/` |

On desktop the site is a set of full-screen panels in flat brand colours that you step through with a curved wipe, opening with a "diamond window" intro based on the logo; a soft glow follows the mouse. Phones, tablets and visitors who prefer reduced motion get a normal scrolling page, where each section fades from top to bottom.

The home page has the whole menu in one section: visitors pick a category tab (hot coffees, cold drinks, shakes…) and only that category shows, sized to fit one screen on desktop. The separate menu page lists everything with a search box. The Google map in the contact section loads by itself when the visitor gets near it, never on the first screen.

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
| Menu items, prices and photo names (both pages read it) | `content/menu.json` |
| Evening programme (match screenings, live music) | `content/events.json` |
| Brand colours and fonts | `brand.json`, mirrored in `src/styles/global.css` |
| Photos | `src/assets/images/` (referenced by file name from the content files); drink photos in `src/assets/images/menu/` |
| Page sections | `src/components/` (each section is a `Panel`; the menu section is `MenuPanel.astro`, the menu page `MenuPage.astro`) |
| Desktop panel navigation and curved wipe | `src/scripts/deck.ts` |
| Project brief and open items | `brief.md` |

Every text change has to be made in both language files.

### Changing the menu

Everything is in `content/menu.json`:

- **Price:** change `price` (numbers only, the ₺ is added automatically; two sizes are written `"50 / 80"`).
- **New item:** add `{ "id": "my-drink", "name": "My Drink", "price": "250", "photo": "menu/my-drink.jpg" }` to its section, and put the photo (about 960px wide) in `src/assets/images/menu/`. Add `"tr": "…"` when the Turkish name differs.
- **Remove an item:** delete its line (or move it to `_removed` to keep it for later).

Both the home page menu and the menu page update from this one file.

## Deploying

The build output is a static folder, so any static host works. On Cloudflare Pages: build command `npm run build`, output directory `dist`.

## Status

Accepted by the café; being finished for launch. Menu prices are taken from the café's menu boards. Several photos are temporary (some AI-generated, including the drink photos) and will be replaced with real photos of the café before launch. See the open items in `brief.md`.
