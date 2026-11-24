# Content editor (Sveltia CMS)

The café owner edits the site's content himself at **https://<site>/admin/**, in Turkish:

| Form | Saves to | What he can change |
|---|---|---|
| Etkinlikler | `content/events.json` | Match screenings and live-music nights (date, time, teams, name, short text, photo) |
| Menü ve fiyatlar | `content/menu.json` | Names, prices, photos, "hide on the website"; new items; alcohol groups and drinks |
| Çalışma saatleri ve iletişim | `content/business.json` | Opening hours per day, phone, WhatsApp, Instagram, Facebook, address, Maps link |
| Ana sayfa yazıları | `content/tr/site.json`, `content/en/site.json` | First-screen lines and the student-discount texts, Turkish and English side by side |

The layout, design and code are not in the forms, so he can't break them. Menu sections are fixed (no adding, removing or reordering). Every save is a Git commit, so any change can be seen and undone in the repository history.

How it works: Sveltia CMS is a free, open-source editor that runs in the browser (`public/admin/index.html` loads it from a CDN, pinned to one version; the forms are in `public/admin/config.yml`). It reads and writes the content files in the GitHub repository through the owner's GitHub account. Cloudflare Pages sees the commit and rebuilds the site, live in about 1–2 minutes. Uploaded photos are resized to 1600 px and converted to WebP in the browser before they're saved.

## One-time set-up (developer)

You need: the GitHub repository, a Cloudflare account, and about 30 minutes.

1. **Deploy the site from GitHub on Cloudflare Pages** (if not done yet). Workers & Pages → Create → Pages → Connect to Git → `farshid92/quadro-coffee`. Build command `npm run build`, output directory `dist`. From then on, every push to `main` (including the owner's saves) deploys automatically.

2. **Deploy the sign-in helper.** GitHub sign-in needs a tiny server that keeps the OAuth secret; Sveltia provides one as a free Cloudflare Worker: https://github.com/sveltia/sveltia-cms-auth → "Deploy to Cloudflare". Note its URL, e.g. `https://sveltia-cms-auth.<your-subdomain>.workers.dev`.

3. **Create a GitHub OAuth app** at https://github.com/settings/applications/new
   - Application name: `Quadro Coffee İçerik`
   - Homepage URL: the site's address
   - Authorization callback URL: `<worker URL>/callback`
   - Then "Generate a new client secret". Copy the Client ID and the secret.

4. **Give the Worker its settings.** Cloudflare → the `sveltia-cms-auth` Worker → Settings → Variables and secrets:
   - `GITHUB_CLIENT_ID` = the Client ID
   - `GITHUB_CLIENT_SECRET` = the secret (type **Secret**, so it's encrypted)
   - `ALLOWED_DOMAINS` = the site's domain(s), e.g. `quadrocoffee.com, quadro-coffee.pages.dev`

   The secret lives only there. Never put it in the repository.

5. **Point the editor at the Worker.** In `public/admin/config.yml`, replace `https://sveltia-cms-auth.CHANGE-ME.workers.dev` with the Worker URL. Commit and push.

6. **Give the owner access.**
   - He creates a free GitHub account (https://github.com/signup, his email is enough).
   - Repository → Settings → Collaborators → Add people → his username. He accepts the invitation from his email.
   - Sit with him once: open `/admin/`, "GitHub ile Giriş Yap", change something small, save, and watch it appear on the site.

7. **Check** the site after his first save, and keep an eye on the commit history for the first weeks.

### Updating the editor

The Sveltia CMS version is pinned in `public/admin/index.html` (`@sveltia/cms@0.270.1`). To update: change the number to the latest release, open `/admin/` locally (see below), check the four forms open and save, then push.

### Using the editor locally

`npm run dev`, then open `http://localhost:4321/admin/` in Chrome or Edge, choose **Yerel Repo ile Çalış** and pick the project folder. It edits the files on disk, with no GitHub sign-in. Handy for trying changes to `config.yml`.

### Notes for whoever maintains this

- Fields the editor doesn't show but must keep (`id`, `icon`, map coordinates) are `widget: hidden` in `config.yml`; tested to be preserved on save.
- The editor writes empty optional fields as `""`, `false` or `null`; the site code treats those as "not set" (e.g. an empty Turkish name falls back to the board name).
- Hours are typed per day as `07:30-23:00` or `Kapalı`; event times as `20:00` (`20.00` and `9:00` also work).
- Don't name a sub-field `name` when it holds an object (Sveltia's lists then show no items); that's why music nights use `title`.

---

## Kısa rehber (işletme sahibi için)

**Giriş:** Tarayıcıda `<site adresi>/admin` adresini açın → **GitHub ile Giriş Yap**. Bilgisayarda veya telefonda çalışır.

**Kaydetmek:** Değişiklikten sonra sağ üstteki **Kaydet** düğmesine basın. Değişiklik 1–2 dakika içinde sitede görünür.

**Etkinlik eklemek:** Etkinlikler → *Maç Ekle* veya *Canlı müzik gecesi Ekle* → tarih, saat ve adı yazın → isterseniz fotoğraf ekleyin → Kaydet. Geçmiş etkinlikleri silmenize gerek yok; sitede her zaman sıradaki gösterilir. İngilizce alanları boş bırakırsanız Türkçesi gösterilir.

**Fiyat değiştirmek:** Menü ve fiyatlar → bölümü açın (örn. Sıcak kahveler) → ürünü açın → Fiyat → Kaydet. Sadece rakam yazın: `240`. İki boy için: `190 / 210`.

**Yeni ürün:** Bölümü açın → en alttaki *Ürün Ekle* → ad, fiyat, fotoğraf → Kaydet.

**Ürünü geçici olarak kaldırmak:** Ürünü açın → **Sitede gizle**'yi açın → Kaydet. Geri getirmek için kapatın.

**Çalışma saatleri:** Her gün için `07:30-23:00` gibi yazın; kapalı günler için `Kapalı`.

**Fotoğraflar:** Telefonla çekilmiş fotoğraf olur; site onu otomatik küçültür. Yatay veya kare fotoğraflar menüde, dikey (portre) fotoğraflar canlı müzikte en iyi görünür.

**Bir sorun olursa:** Hiçbir şey kaybolmaz; her kayıt saklanır ve geri alınabilir. Farshid'e yazın.
