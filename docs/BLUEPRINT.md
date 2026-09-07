# BLUEPRINT — IDE POSTING FB HARIAN

## 1. Visi

Membangun web app ringan yang membantu kreator Facebook dan pengguna nonteknis mendapatkan ide posting harian yang relevan, membuat caption siap pakai, lalu menyalin atau menyimpannya dengan langkah seminimal mungkin.

## 2. Prinsip inti

1. **Small surface, strong engine.** UI hanya menampilkan kebutuhan yang benar-benar diperlukan.
2. **Mobile first.** Pengalaman utama dirancang untuk layar HP.
3. **Engine first.** Kompleksitas berada di domain/service layer, bukan di navigasi.
4. **AI optional.** Tanpa AI pun sistem harus menghasilkan ide dasar melalui data terstruktur dan aturan deterministik.
5. **Safe fallback.** Kegagalan provider tidak boleh membuat aplikasi tidak dapat digunakan.
6. **Provider agnostic.** AI, advertising, dan affiliate berada di belakang adapter/contract.
7. **Monetization ready.** Arsitektur sejak awal menyediakan ruang AdSense dan Shopee Affiliate tanpa mengikat seluruh aplikasi pada provider.
8. **No scraping dependency.** Tidak ada ketergantungan pada scraping/crawling Shopee.
9. **Quality before scale.** Setiap fase harus melewati quality gate sebelum diperluas.

## 3. Target pengguna

### Persona utama

- Kreator Facebook pemula.
- Kreator Facebook aktif.
- Ibu rumah tangga yang membuat konten dari HP.
- Affiliate creator pemula.
- UMKM kecil yang memakai Facebook sebagai kanal promosi.

### Kebutuhan utama

- Tidak tahu harus posting apa.
- Ingin konsisten setiap hari.
- Tidak ingin memahami strategi konten yang rumit.
- Ingin tulisan siap edit/copy.
- Ingin memiliki opsi konten yang dapat dikaitkan dengan affiliate.

## 4. Value proposition

> **Buka → pilih tema → dapat 5 ide → buat posting → salin/simpan.**

Target UX: pengguna memperoleh nilai pertama dalam kurang dari satu menit.

## 5. User journey

```text
Buka
 ↓
Pilih tema
 ↓
5 ide hari ini
 ↓
Pilih satu
 ↓
Buat posting
 ↓
Salin / simpan
```

## 6. User-facing surface MVP

Navigasi minimal:

- Beranda
- Ide
- Rencana
- Disimpan/Saya

Pada MVP awal, beberapa area dapat masih berupa fungsi ringan di satu halaman. Jangan membuat dashboard analytics besar.

## 7. Core content engine

Input:

- niche
- content pillar
- content angle
- format
- tanggal/konteks musiman
- riwayat ide user bila tersedia

Output:

- title/topic
- hook
- body direction
- CTA
- format
- optional affiliate opportunity

Flow:

```text
Profile/Niche
    +
Pillar
    +
Angle
    +
Format
    +
Date context
    ↓
Deterministic ranking
    ↓
Five ideas
    ↓
Post generator
```

## 8. Content taxonomy

### Niche MVP

- Rumah Tangga
- Masakan
- Parenting
- Lifestyle
- Fashion
- Affiliate

### Pillar MVP

- Tips
- Relatable
- Engagement
- Story
- Recommendation

### Angle MVP

- Problem → Solution
- Listicle
- Question
- Storytelling
- Recommendation

### Format MVP

- Feed
- Reels
- Story

## 9. Deterministic engine rules

- Hasil harus reproducible untuk kombinasi niche + tanggal yang sama.
- Lima ide tidak boleh memiliki judul identik.
- Ide tidak boleh keluar dari niche/pillar/angle yang valid.
- Required fields wajib terisi sebelum output dikirim ke UI.
- Generator tidak boleh membuat klaim penghasilan pasti atau jaminan viral.
- Riwayat user, jika sudah tersedia, dipakai untuk mengurangi pengulangan.

## 10. AI architecture

AI tidak boleh dipanggil langsung dari komponen UI.

```text
UI
 ↓
Application Service
 ↓
Content Engine
 ↓
Prompt Assembly
 ↓
AI Adapter (optional)
 ↓
Validation
 ↓
Output
```

Fallback:

```text
AI unavailable / timeout / invalid output
 ↓
Deterministic template output
```

Provider credentials hanya di server-side environment.

## 11. Data architecture

MVP dapat dimulai dengan content library statis + local storage, kemudian naik ke PostgreSQL/Supabase ketika persistence server diperlukan.

Target domain:

```text
users
profiles
niches
content_pillars
content_angles
content_templates
content_ideas
generated_posts
saved_posts
content_calendar
products
affiliate_links
affiliate_clicks
usage_events
```

## 12. Server/service boundary

UI tidak boleh langsung:

- mengakses database provider secara bebas,
- menempatkan secret,
- memanggil AI provider dengan credential,
- membuat aturan affiliate sendiri.

Gunakan service boundary:

```text
UI → Application Service → Domain/Provider Adapter → Data/External Provider
```

## 13. Monetization architecture

### Advertising

```text
Public SEO Page
   ↓
Ad Slot
   ↓
Advertising Adapter
   ↓
AdSense / future provider
```

Aturan:

- Provider ID/config tidak ditulis di content component.
- Placeholder boleh aktif saat development.
- Actual serving bergantung pada konfigurasi dan approval provider.
- Authenticated app UX tidak dipenuhi iklan.

### Affiliate

```text
Content Idea
   ↓
Relevant Product
   ↓
Affiliate Adapter
   ↓
Affiliate URL
   ↓
Outbound click tracking
```

Aturan:

- Shopee adalah provider pertama yang direncanakan.
- Jangan membangun scraping/crawling dependency.
- Affiliate disclosure wajib tersedia.
- Tidak menjanjikan komisi atau pendapatan tertentu.

## 14. Public SEO architecture

Public pages menjadi acquisition + advertising surface:

- `/ide-postingan-facebook`
- `/ide-postingan-facebook-hari-ini`
- `/ide/[niche]`
- `/tentang`
- `/privasi`
- `/ketentuan`
- `/affiliate`

SEO quality rule: halaman publik harus memberi nilai nyata dan bukan sekadar halaman mass-generated tipis.

## 15. UX rules untuk pengguna nonteknis

Gunakan bahasa sederhana:

- Ide Hari Ini
- Buat Posting
- Salin
- Simpan
- Produk Pilihan
- Rencanakan

Hindari istilah teknis seperti semantic ranking, prompt engineering, conversion optimization, atau provider adapter di UI user.

## 16. Security baseline

- Strict server/client boundary.
- Input validation.
- Output validation.
- Rate limit pada operasi mahal.
- Tidak ada secret di Git.
- Safe URL handling untuk outbound affiliate.
- Error response tidak membocorkan secret/internal stack.
- Logging terstruktur tanpa data sensitif.

## 17. Quality gate

Urutan wajib:

```text
Typecheck
 ↓
Lint
 ↓
Unit tests
 ↓
Integration tests
 ↓
Build
 ↓
Security review
 ↓
E2E smoke test
```

## 18. Definition of Done MVP

- User dapat memilih niche.
- Sistem menghasilkan lima ide.
- User dapat membuka ide.
- User dapat menghasilkan posting.
- User dapat menyalin posting.
- User dapat menyimpan posting.
- App tetap usable tanpa AI provider.
- Mobile UI usable.
- Public SEO page tersedia.
- Legal/disclosure page tersedia.
- Ad slot abstraction tersedia.
- Affiliate contract tersedia.
- CI typecheck/lint/test/build tersedia.
- Tidak ada secret di source.
