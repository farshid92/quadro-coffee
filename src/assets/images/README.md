# Photos

Astro converts these to WebP, sizes them and lazy-loads them automatically. A file name that doesn't exist shows a labelled placeholder box instead.

- `hero-terrace-night.jpg`: the home page's first screen (the terrace in the evening), set in `content/tr|en/site.json` → `hero.image`
- `street.jpg`: background of the contact section (`visit.image`)
- `sidar-karakus.jpg`: live music evening (`content/events.json`)
- `menu/`: one photo per drink, about 960px wide, named after the item's `id` in `content/menu.json`. The menu, the menu page and the student discount section all use these.

To add a drink photo: save it as `menu/<item-id>.jpg` and set `"photo": "menu/<item-id>.jpg"` on the item in `content/menu.json`.
