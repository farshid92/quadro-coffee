# Studio starter: local business website

This repo is the starting point for every client site. Copy it per client, then fill `content/` and `brand.json`.
I (Farshid) approve every stage. Never move to the next stage without my explicit approval in chat.

## Stack
- Astro + TypeScript, Tailwind CSS
- Content in `content/` as Markdown/JSON, one folder per language (`tr/`, `en/`)
- Optional headless CMS (Decap CMS) for clients on the Business package, so they can edit text themselves
- Deploy: Cloudflare Pages, one project per client
- No paid dependencies, no tracking scripts except the analytics I add explicitly

## Project files
- `brief.md`: research brief and approved strategy for this client. Read it before any work.
- `brand.json`: colours, fonts, logo paths, tone of voice. All styling comes from here.
- `content/`: approved copy only. Never invent prices, opening hours, phone numbers, reviews or claims; leave a `TODO:` marker instead.
- `src/components/`: shared sections (Hero, Services, Menu, Gallery, Testimonials, Map, Contact, Booking). Reuse before creating new ones.

## Rules
1. Mobile first. Check every page at 375px width before desktop.
2. Every page has: title, meta description, Open Graph image, LocalBusiness JSON-LD with real data from `brief.md`.
3. A visible WhatsApp button and click-to-call link on every page.
4. Images: WebP/AVIF, lazy-loaded, explicit width and height. Lighthouse target: 90+ on all four scores.
5. Accessibility: semantic HTML, alt text on every image, colour contrast AA, keyboard navigable.
6. Bilingual: every string exists in `tr` and `en`. Language switcher in the header. `hreflang` tags set.
7. Keep components small and readable; the client may get a different developer one day.
8. Never commit secrets. Form endpoints and keys go in environment variables.

## Workflow stages (stop after each for approval)
1. Read `brief.md` and `brand.json`; list anything missing.
2. Propose the sitemap and section order per page.
3. Build pages with placeholder-free approved content.
4. Run QA: build, Lighthouse, broken links, mobile check, both languages; report results.
5. Prepare deploy and the client handoff notes (`HANDOFF.md`).

## Definition of done
- Builds with no errors or warnings
- All `TODO:` markers resolved or listed for me
- QA report attached
- `HANDOFF.md` explains how the client edits content and who to contact

## This project: Quadro Coffee (demo)
- Status: design v3 approved as a direction; now refining the build. Content still has `TODO:` markers (prices, photos, reviews, schedule) — see `brief.md`.
- Visible text lives in `content/tr/site.json` and `content/en/site.json`. Business facts (phone, address, hours, links) live in `src/lib/business.ts`. Colours live in `src/styles/global.css` (`@theme`), mirroring `brand.json`.
- Photos go in `src/assets/images/` and are referenced by file name from the content JSON; `Photo.astro` shows a placeholder when a file is missing.
- Run: `npm install`, then `npm run dev` (http://localhost:4321) and `npm run build`.
