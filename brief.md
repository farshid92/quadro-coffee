# Quadro Coffee: brief

Accepted by the owner (a friend; first client). Being prepared for launch on Cloudflare.

## Business (verified from public listings, 30 Oct 2026)
- **Name:** Quadro Coffee (listings say "3rd generation coffee shop", but per Farshid that is not the focus)
- **Offer (per Farshid, 30 Oct 2026):** hot and cold coffees, non-coffee drinks, wine, beer (not craft) and whisky. Desserts are not a focus; keep them off the site.
- **Address:** Memduh Asaf Sokak No 15/C, Köşklüçiftlik, Lefkoşa 1010 (Osmanpaşa Caddesi side). Neighbourhood per Farshid; listings said Dereboyu.
- **Phone:** +90 548 889 73 21
- **Hours:** set in the content editor (`content/business.json`). Google listed Mon, Tue, Thu 07:30–23:00 · Wed, Fri, Sat 07:30–23:30 · Sun 09:00–23:00; changed on 25 Nov 2026 to Mon–Sat 08:00–23:00 · Sun 09:00–23:00 (confirm with owner)
- **Google:** 4.7★ from 37 reviews; no website; listing shows "Own this business?" (likely unclaimed)
- **Instagram:** @quadrocyprus, verified, ~1,590 followers. Highlights: live music, gelato, Dubai cake, cakes, Dubai cheesecake
- **Facebook:** "Quadro Coffee", ~250 followers
- **Service:** dine-in and takeaway, no delivery (per Google). Terrace. Cards and contactless accepted.
- **Audience:** university students (CIU discount), groups, locals; football match nights; live music
- **Student discount (permanent, per Farshid, 20 Nov 2026):** 10% for students showing a student card. The site shows Americano, Iced Americano, Latte and Iced Latte as the discounted coffees (confirm whether it is these or everything)

## Goal of the site
Visitors from Instagram and Google on their phone should quickly see: what's special, the menu with prices, where it is, when it's open, and how to contact (WhatsApp/phone/directions).

## Design direction (approved v3)
Light, warm layout inspired by a coffee-shop landing page reference: full-width photo hero, beige category strip, product cards, promo band, evening events, reviews, visit section, dark footer. Colours and type in `brand.json`.

## Sitemap
Turkish at `/`, English at `/en/`. Home page sections: Hero · Menu (category tabs) · Student discount · Evenings · Reviews · Visit · Footer. Full menu page at `/menu/` and `/en/menu/`. Content editor for the owner at `/admin/` (see `docs/cms-setup.md`).

## Open items (TODO)

Before launch:
- [ ] **Evening programme is still DEMO data** (`content/events.json`): invented dates, teams and music nights, including a night with Sidar Karakuş's name and photo. Replace with the owner's real programme in the editor, or empty both lists (the panel then says a new programme is coming soon)
  - Sidar Karakuş's photo is cropped from a Quadro poster (her real night there was 17 June): confirm with the owner/artist before using it for a real night
- [ ] Confirm with the owner: opening hours (now Mon–Sat 08:00–23:00, Sun 09:00–23:00), WhatsApp number (assumed same as the phone), Freddo Espresso price (₺130 since 25 Nov; the board said ₺230), which coffees the student discount covers
- [ ] Reviews: 3 real Google reviews (Johannes M., Vahid M., Melin, picked 4 Nov 2026) need the owner's OK; Turkish translations need a native check; update the rating and count (4.7 from 37, 4 Nov 2026) in `content/*/site.json`
- [ ] Owner check of the Turkish copy; native check of the English copy
- [ ] Domain: buy `quadrocoffee.com`, connect it to the `quadro-coffee` Worker, then set `site` in `astro.config.mjs` and the OAuth app's homepage URL
- [ ] Owner's GitHub account and repository access (step 4 in `docs/cms-setup.md`)

After launch:
- [ ] Claim the Google Business Profile ("Own this business?") and add the website link
- [ ] Real photos: the hero is an AI-edited version of a real terrace photo; the drink photos are AI-composed from the café's cups. Replace with real photos over time
- [ ] Logo as SVG or high-res file (current source: `src/assets/brand/quadro-logo-original.png`, 1254 px)
- [ ] Optional: Cloudflare Web Analytics (free, no cookies) if the owner wants visitor numbers
