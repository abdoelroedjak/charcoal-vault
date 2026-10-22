# Charcoal Vault — Technical SEO Optimization Plan

Implementasi perbaikan teknis SEO terarah untuk menyelaraskan domain canonical, metadata OpenGraph, validasi robots.txt/sitemap.xml, dan JSON-LD Structured Data dengan domain produksi Vercel (`https://charcoal-vault.vercel.app/`), dengan mempertahankan 100% desain industrial-minimalis, harga produk, spesifikasi, dan fungsionalitas RFQ.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan Dikonfirmasi oleh User:**
> - **Domain Rujukan Utama**: Menggunakan `https://charcoal-vault.vercel.app/` sebagai basis Canonical URL, OpenGraph, Twitter Cards, dan Schema URL agar terindeks sempurna dan selaras dengan Google Search Console.
> - **Structured Data Scope**: Mempertahankan dan menyempurnakan Schema `Organization` yang sudah ada (tidak menambahkan `FAQPage` schema sesuai instruksi pengguna), dengan menyelaraskan URL entitas dan logo ke domain produksi.
> - **Zero-Redesign & Zero-Price-Change**: Tidak ada perubahan pada gaya visual, palet warna, tipografi, harga EXW/FOB, MOQ 18 MT, spesifikasi ASTM, atau alur pengiriman formulir inquiry.

---

### 1. Overview & Core Concept

- **Tujuan**: Memastikan situs Charcoal Vault diindeks secara akurat oleh Google tanpa peringatan *duplicate content* atau *canonical mismatch*, meningkatkan rasio klik (CTR) organik melalui cuplikan sosial dan SERP yang kaya.
- **Target Audiens**: Pemilik shisha lounge, pengelola hookah bar, distributor regional, dan pembeli B2B arang kelapa internasional yang mencari mitra pasokan terpercaya dari Indonesia.
- **Nilai Tambah**: Struktur teknis SEO yang bersih dan konsisten antara live URL, Google Search Console, sitemap XML, dan metadata crawler.

---

### 2. User Experience & Visual Design

- **Konsistensi Visual**: Tampilan antarmuka tidak mengalami perubahan kosmetik. Desain gelap industrial minimalis (`#080808`, `#111111`, aksen merah arang `#b8332a`, dan tipografi Inter) tetap 100% identik dengan kondisi saat ini.
- **Social Sharing Preview**: Tautan yang dibagikan melalui WhatsApp, LinkedIn, X/Twitter, dan Discord akan merender thumbnail kartu beresolusi tinggi (`og:image:width`, `og:image:height`, `og:image:alt`) dengan judul dan deskripsi terarah.
- **SEO Accessibility**: Atribut meta, OpenGraph, dan Schema terstruktur rapi di level `<head>` tanpa membebani performa render client-side.

---

### 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Standardisasi URL Domain Tunggal (`https://charcoal-vault.vercel.app/`)**
  - *Pendekatan*: Menyelaraskan seluruh meta tag `<link rel="canonical">`, `<meta property="og:url">`, `<meta property="og:image">`, `<meta name="twitter:image">`, serta Schema `Organization.url` dan `Organization.logo` ke `https://charcoal-vault.vercel.app/`.
  - *Alasan*: Menghilangkan risiko de-indexing dari Google akibat kanonikal yang mengarah ke domain pihak ketiga/belum aktif.
  - *Alternatif Ditolak*: Membiarkan `charcoalvault.com` dapat menyebabkan Google menganggap versi Vercel sebagai duplikat tidak sah.

- **Keputusan 2: Penyempurnaan Meta Description (145 Karakter)**
  - *Pendekatan*: Menyesuaikan meta description menjadi: `Reliable B2B coconut shell charcoal supplier for shisha lounges, hookah bars, & bulk buyers. Direct Indonesia sourcing with flexible 18 MT orders.`
  - *Alasan*: Panjang optimal untuk SERP Google (tidak terpotong di desktop/mobile) dan mempertegas posisi sebagai supply partner Indonesia.

- **Keputusan 3: Penyempurnaan Schema `Organization` Eksisting**
  - *Pendekatan*: Mempertahankan tipe `Organization` murni sesuai instruksi pengguna, dengan menyempurnakan `url`, `logo`, `contactPoint` (customer support via WhatsApp & email), dan `areaServed: "Worldwide"`.
  - *Alasan*: Memberikan sinyal entitas bisnis yang kuat kepada Knowledge Graph Google tanpa melanggar batasan pengguna.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   Search Engine Crawlers               │
│                 (Googlebot, Bingbot, Social)           │
└───────────────────────────┬────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
      ┌─────────────────┐       ┌─────────────────┐
      │   robots.txt    │       │   sitemap.xml   │
      │   (public/)     │       │   (public/)     │
      └────────┬────────┘       └────────┬────────┘
               │                         │
               └────────────┬────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │        index.html         │
              │  - Canonical Tag          │
              │  - Meta Title & Desc      │
              │  - OpenGraph & Twitter    │
              │  - JSON-LD Organization   │
              └─────────────┬─────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │    React 19 Application   │
              │    (Zero Functional /     │
              │     Visual Modifications) │
              └───────────────────────────┘
```

#### Rencana Modifikasi File:

1. **`index.html`**:
   - Perbarui `<link rel="canonical" href="https://charcoal-vault.vercel.app/" />`.
   - Perbarui `og:url` ke `https://charcoal-vault.vercel.app/`.
   - Perbarui `og:image` dan `twitter:image` ke `https://charcoal-vault.vercel.app/img/hero-charcoal.jpg`.
   - Tambahkan `og:image:width`, `og:image:height`, `og:image:alt`, `og:site_name`, dan `og:locale`.
   - Optimalkan meta description menjadi ringkas dan padat.
   - Perbarui `url` dan `logo` pada JSON-LD `Organization` ke domain Vercel.

2. **Verifikasi Build**:
   - Jalankan `compile_applet` untuk memastikan kompilasi tetap bersih dan bebas error.
