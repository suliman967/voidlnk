# Portfolio — Customization Guide

A premium dark-mode copywriter portfolio built with HTML, CSS, and vanilla JS.
No build step required — open index.html directly or use VS Code Live Server.

## Folder Structure

```
portfolio/
├── index.html          ← All content (look for CUSTOMIZE comments)
├── css/
│   ├── reset.css       ← Browser reset (do not edit)
│   ├── tokens.css      ← ★ Colors, fonts, spacing — edit here first
│   ├── style.css       ← Layout & component styles
│   └── animations.css  ← Scroll reveals & motion
├── js/
│   ├── cursor.js       ← Custom cursor
│   ├── nav.js          ← Nav scroll + mobile menu
│   ├── scroll.js       ← Reveal-on-scroll
│   └── three-scene.js  ← 3D particle wave (Three.js)
├── assets/
│   ├── images/         ← Your project images go here
│   └── fonts/          ← Local fonts (optional)
└── README.md
```

## Quick Customization Checklist

### 1. Your Content (index.html)
Every editable block is marked with a CUSTOMIZE comment.
- Nav logo text, CTA email
- Hero headline, sub copy, button text
- About bio, stats
- Case study titles, summaries, results, links
- Service titles, descriptions, prices
- Testimonials: quote, name, company
- Contact email, social links
- Footer name and email

### 2. Colors (css/tokens.css)
| Variable        | Default   | Purpose          |
|-----------------|-----------|------------------|
| --clr-bg        | #0a0a0a   | Page background  |
| --clr-accent    | #c9a96e   | Gold highlights  |
| --clr-text      | #e8e4dc   | Main text        |
| --clr-muted     | #6b6660   | Secondary text   |
| --clr-surface   | #111111   | Card backgrounds |

### 3. Fonts (css/tokens.css)
--font-display controls headings (default: Cormorant Garamond)
--font-body controls body text (default: DM Sans)
Swap Google Fonts link in index.html then update these two variables.

### 4. 3D Scene (js/three-scene.js)
Edit PARAMS object at the top of the file:
- particleCount: more = denser (costs performance)
- waveSpeed: faster = more energetic
- waveAmplitude: bigger = taller waves
- colorA / colorB: hex colors for particles
- particleSize: dot size

## Deployment
Works on Netlify, Vercel, GitHub Pages.
No build step — just drag the folder to Netlify Drop.
