# Charcoal Vault — Shisha Charcoal Supply (React + Vite)

Premium B2B coconut shell shisha charcoal trading and export supply web application, rewritten in React + Vite with TypeScript.

## Overview
Charcoal Vault connects international buyers, shisha lounges, retailers, and distributors with reliable, supplier-backed coconut shell charcoal.

- **MOQ (Minimum Order Quantity)**: 18 Metric Tons (18 MT / 18,000 kg)
- **Primary Product**: Coconut Shell Cube Charcoal (Standard 25mm / 26mm, Custom dimensions available)
- **Packaging Options**: Goods Only + Inner Plastic, Masterbox Doublewall 10kg, Innerbox 1kg + Masterbox 10kg
- **Shipping Terms Supported**: EXW, FOB
- **Direct Contact**: 
  - Email: [charcoalvault@gmail.com](mailto:charcoalvault@gmail.com)
  - WhatsApp: [+62 812-9477-9925](https://wa.me/6281294779925)

## Laboratory Specifications (ASTM Standards)
- **Ash Content**: 1.79% (Wet Basis) / 1.89% (Dry Basis) — ASTM D1762-84
- **Calorific Value**: 7,211 Kcal/kg (Wet) / 7,625 Kcal/kg (Dry) — ASTM D5865-19
- **Fixed Carbon**: 77.23% (Wet Basis) / 81.67% (Dry Basis)
- **Moisture**: 5.43%
- **Volatile Matter**: 15.55%

## Tech Stack & Architecture
- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Precision Dark Industrial Theme Design System (CSS custom properties, fluid typography, responsive layout)
- **Interactivity**: Scroll-aware navigation, mobile navigation drawer, interactive FAQ accordion, live inquiry WhatsApp URL composer, FormSubmit AJAX with resilient fallbacks.

## Development
```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Build production bundle
npm run build
```

## Project Structure
```
charcoal-vault/
├── index.html              # HTML entry point with metadata & JSON-LD structured data
├── metadata.json           # Studio metadata configuration
├── package.json            # Scripts & dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── public/                 # Static assets (images, sitemaps, robots)
│   ├── img/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/         # Modular React components
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Faq.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── HowWeSupply.tsx
│   │   ├── InfoStrip.tsx
│   │   ├── MobileStickyCta.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pricing.tsx
│   │   ├── Products.tsx
│   │   ├── Specifications.tsx
│   │   ├── WhoWeSupply.tsx
│   │   └── WhyCharcoal.tsx
│   ├── data/
│   │   └── charcoalData.ts # ASTM specs, pricing structure, business logic
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Global design system
│   └── main.tsx            # React client mount
└── README.md
```
