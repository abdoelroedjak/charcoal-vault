---
version: 1.0.0
name: Charcoal-Vault-Design-System
description: "An austere B2B industrial-luxury interface for Indonesian coconut shell charcoal supply. Built around a deep void-black canvas (#080808), charcoal panels (#111111 / #141414), hairline borders (1px rgba(255, 255, 255, 0.08)), and incandescent ember accents (#b8332a / #e8453c) with metallic gold/blue/purple product trims. Typography uses disciplined uppercase tracking for technical metadata and clean, high-legibility sans-serif for body. Zero generic AI slop, zero bubbly pastels, zero floating drop-shadow cards."

anti-patterns:
  - "NEVER use generic purple-indigo gradient buttons or bubbly rounded pills."
  - "NEVER use heavy blurred box-shadows (elevation comes from subtle surface tone shifts and 1px hairlines)."
  - "NEVER use generic corporate 3D illustrations or cartoon icons."
  - "NEVER center large blocks of technical data; use tabular figures and structured definition lists."
  - "NEVER use decorative fluff; every visual element must represent real product materials, packaging, or supply metrics."

colors:
  canvas: "#080808"
  canvas-subtle: "#0e0e0e"
  surface-card: "#111111"
  surface-card-hover: "#151515"
  surface-elevated: "#181818"
  
  # Hairline Borders
  hairline: "rgba(255, 255, 255, 0.08)"
  hairline-strong: "rgba(255, 255, 255, 0.16)"
  hairline-subtle: "rgba(255, 255, 255, 0.04)"
  
  # Brand & Incandescent Accents
  accent-ember: "#b8332a"
  accent-ember-bright: "#e8453c"
  accent-ember-glow: "rgba(184, 51, 42, 0.15)"
  
  # Product Edition Accents
  gold-metallic: "#f6d285"
  gold-glow: "rgba(246, 210, 133, 0.12)"
  blue-flame: "#93c5fd"
  blue-glow: "rgba(147, 197, 253, 0.12)"
  purple-hexa: "#d8b4fe"
  purple-glow: "rgba(216, 180, 254, 0.12)"
  
  # Typography / Ink
  text-primary: "#ffffff"
  text-body: "#cccccc"
  text-muted: "#888888"
  text-dim: "#555555"

typography:
  font-family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  
  display-headline:
    fontSize: "clamp(2.4rem, 6vw, 4.2rem)"
    fontWeight: 700
    letterSpacing: "-0.02em"
    textTransform: "uppercase"
    lineHeight: 1.05
    
  section-title:
    fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)"
    fontWeight: 700
    letterSpacing: "0.04em"
    textTransform: "uppercase"
    lineHeight: 1.15
    
  eyebrow:
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.16em"
    textTransform: "uppercase"
    color: "var(--c-accent)"
    
  spec-label:
    fontSize: "0.7rem"
    fontWeight: 600
    letterSpacing: "0.12em"
    textTransform: "uppercase"
    color: "#555555"
    
  spec-value:
    fontSize: "0.88rem"
    fontWeight: 500
    fontFeatureSettings: "'tnum' on, 'cv05' on"
    color: "#ffffff"

components:
  card:
    background: "#111111"
    border: "1px solid rgba(255, 255, 255, 0.08)"
    borderRadius: "0px" # Sharp corners for architectural precision
    overflow: "hidden"
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease"
    hover:
      borderColor: "rgba(255, 255, 255, 0.2)"
      
  button-primary:
    background: "#ffffff"
    color: "#080808"
    fontWeight: 600
    fontSize: "0.78rem"
    letterSpacing: "0.12em"
    textTransform: "uppercase"
    borderRadius: "2px"
    padding: "14px 28px"
    transition: "background 0.25s ease, transform 0.25s ease"
    hover:
      background: "#e5e5e5"
      transform: "translateY(-1px)"
      
  button-outline:
    background: "transparent"
    color: "#ffffff"
    border: "1px solid rgba(255, 255, 255, 0.16)"
    fontWeight: 600
    fontSize: "0.78rem"
    letterSpacing: "0.12em"
    textTransform: "uppercase"
    borderRadius: "2px"
    padding: "14px 28px"
    hover:
      borderColor: "#ffffff"
      background: "rgba(255, 255, 255, 0.04)"

  tag-badge:
    borderRadius: "2px"
    fontSize: "0.65rem"
    fontWeight: 700
    letterSpacing: "0.12em"
    textTransform: "uppercase"
    padding: "3px 8px"

imagery:
  treatment: "Dark, tactile, close-up industrial product shots with subtle ember glow and clean packaging mockups on neutral studio backdrops."
  aspect-ratio: "4:3 or 16:9 with smooth hover zoom scale (1.03x to 1.05x)"
  loading: "LCP Hero is eager + fetchpriority=high; all below-fold cards are lazy."
---
