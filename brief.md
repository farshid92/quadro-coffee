# Quadro Coffee: brief

Demo / portfolio project. The owner is a friend; the site will be shown to them before any real launch.

## Business (verified from public listings, 30 Oct 2026)
- **Name:** Quadro Coffee (listings say "3rd generation coffee shop", but per Farshid that is not the focus)
- **Offer (per Farshid, 30 Oct 2026):** hot and cold coffees, non-coffee drinks, wine, beer (not craft) and whisky. Desserts are not a focus; keep them off the site.
- **Address:** Memduh Asaf Sokak No 15/C, Köşklüçiftlik, Lefkoşa 1010 (Osmanpaşa Caddesi side). Neighbourhood per Farshid; listings said Dereboyu.
- **Phone:** +90 548 889 73 21
- **Hours (Google):** Mon, Tue, Thu 07:30–23:00 · Wed, Fri, Sat 07:30–23:30 · Sun 09:00–23:00
  - A directory site (cyprus-faq) lists 09:00–23:00: inconsistent, confirm with owner
- **Google:** 4.7★ from 37 reviews; no website; listing shows "Own this business?" (likely unclaimed)
- **Instagram:** @quadrocyprus, verified, ~1,590 followers. Highlights: live music, gelato, Dubai cake, cakes, Dubai cheesecake
- **Facebook:** "Quadro Coffee", ~250 followers
- **Service:** dine-in and takeaway, no delivery (per Google). Terrace. Cards and contactless accepted.
- **Audience:** university students (CIU discount), groups, locals; football match nights; live music
- **Current campaign:** 10% off Americano, Iced Americano, filter coffee and V60 for all students with a student card, until 15 November (per Farshid, 4 Nov 2026; earlier listed as "everything" for CIU students). The site hides the offer automatically after the last day (`student.lastDay` in the content files)
  - The four discounted coffees (`americano.jpg`, `iced-americano.jpg`, `filter-coffee.jpg`, `v60.jpg`) are AI-generated placeholders; replace with real photos before launch

## Goal of the site
Visitors from Instagram and Google on their phone should quickly see: what's special, the menu with prices, where it is, when it's open, and how to contact (WhatsApp/phone/directions).

## Design direction (approved v3)
Light, warm layout inspired by a coffee-shop landing page reference: full-width photo hero, beige category strip, product cards, promo band, evening events, reviews, visit section, dark footer. Colours and type in `brand.json`.

## Sitemap
Single page, Turkish at `/`, English at `/en/`. Sections: Hero · Categories · Specials · Student discount · Evenings · Reviews · Visit · Footer.

## Open items (TODO)
- [ ] Original photos (hero, 4 specials, promo band, live music, match night)
  - Hero currently uses an AI-generated terrace photo (`src/assets/images/hero-terrace.jpg`); the earlier stock interior (`hero.jpg`) is kept as an alternative. Replace with a real photo of Quadro before launch
  - The 4 specials (`turkish-coffee.jpg`, `latte.jpg`, `iced-latte.jpg`, `iced-v60.jpg`) are AI-generated placeholders; replace with real photos of Quadro's drinks before launch
- [ ] Logo file (SVG or high-res)
- [ ] Full menu with prices (specials are coffee placeholders until then)
- [ ] Real evening programme (matches shown and live-music nights) in `content/events.json`
  - The current November 2026 schedule is DEMO data with invented dates, teams and music nights. Replace it with the owner's real programme before launch, and update it every month (after the last date the panel shows "new schedule coming soon")
  - The 13 Nov demo night uses Sidar Karakuş's photo, cropped from a Quadro poster (her real night there was 17 June, 20:00, tickets via Gişe Kıbrıs). Confirm with the owner/artist that the photo can be used on the website
  - Match and live-music photos: set `matchPhoto` / `musicPhoto` (or `photo` on a single event); until then the scoreboard is plain and the poster shows a drawn spotlight
- [ ] Confirm WhatsApp number (assumed same as phone)
- [ ] 3 real Google reviews the owner is happy to feature
  - Picked from Google (4 Nov 2026): Johannes M., Vahid M., Melin (all 5★, English; Turkish translations added on the TR page). Waiting for the owner's OK; Turkish translations need a native check
- [ ] Confirm opening hours
- [ ] Domain name
- [ ] Owner check of Turkish copy; native check of English copy
