# IDE POSTING FB HARIAN

Web app ringan untuk membantu kreator Facebook dan pengguna nonteknis menemukan ide posting harian, membuat caption siap pakai, lalu menyimpan atau menyalinnya. Produk ini dirancang untuk penggunaan mobile dengan permukaan UI kecil dan mesin konten yang terstruktur.

## Prinsip produk

**Kecil di permukaan, kuat di mesin, mudah digunakan.**

Alur utama:

`Pilih tema → dapat 5 ide → pilih ide → buat posting → salin/simpan`

Tidak ada kebutuhan dashboard rumit pada MVP.

## Target pengguna

- Kreator Facebook pemula dan aktif.
- Ibu rumah tangga yang membuat konten dari HP.
- Affiliate creator yang membutuhkan ide konten.
- UMKM kecil yang mengandalkan Facebook.

## Blueprint dan roadmap

- `docs/BLUEPRINT.md` — blueprint produk, UX, domain engine, data, monetisasi, SEO, security, dan quality gates.
- `docs/ROADMAP.md` — tahapan implementasi dari foundation sampai optimasi revenue.
- `docs/DECISIONS.md` — keputusan teknik yang wajib dipertahankan agar proyek tidak over-engineered.
- `docs/SECURITY.md` — security baseline dan aturan operasional.
- `docs/IMPLEMENTATION-STATUS.md` — checklist pekerjaan dan gate saat ini.

## Arsitektur

```text
UI
 ↓
Application / service layer
 ↓
Content domain engine
 ↓
Data layer

Provider boundaries
 ├─ AI adapter (opsional)
 ├─ Advertising adapter
 └─ Affiliate adapter
```

AI bukan sumber ide tunggal. Structured content data + deterministic rules harus tetap mampu menghasilkan lima ide dasar ketika AI tidak tersedia.

## Monetisasi

### Google AdSense readiness

Halaman publik disiapkan sebagai acquisition layer dengan metadata, sitemap, robots, legal pages, dan generic ad slots. ID/provider credentials tidak ditanam pada komponen konten. Persetujuan dan penayangan AdSense tetap bergantung pada review dan kebijakan Google.

### Shopee Affiliate readiness

Affiliate menggunakan kontrak generik dan adapter. Shopee adalah provider pertama yang direncanakan. Produk/link harus berasal dari mekanisme yang diizinkan oleh program/provider. Proyek tidak memiliki ketergantungan pada scraping atau crawling Shopee.

## MVP scope

- Mobile-first home.
- Theme/niche selection.
- Five daily ideas.
- Deterministic content engine.
- Ready-to-post caption generator.
- Copy and save.
- Local fallback.
- Public SEO content layer.
- Generic AdSense-ready ad slot.
- Generic affiliate/disclosure layer.
- Quality gates melalui CI.

## Explicit non-goals

- Native Android/iOS.
- Auto publishing ke semua platform.
- Marketplace.
- Agency/team management.
- Large analytics suite.
- Autonomous AI agents.
- Shopee scraping/crawling.

## Quality gates

`Typecheck → Lint → Unit tests → Integration tests → Build → Security review → E2E smoke test`

Tidak ada secret di source code. Operasi mahal seperti AI generation dan tracking harus berada di server-side boundary ketika persistence/backend ditambahkan.
