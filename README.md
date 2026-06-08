# ΣΧΑΡΑ — Scroll Demo

Next.js 15 · GSAP ScrollTrigger · Tailwind v4 · Lenis smooth scroll

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Swapping placeholder images with real AI food photos

Every ingredient slot currently shows a CSS gradient fallback. Drop your PNG files into `public/` and the real images will appear automatically — no code changes needed.

### Recommended workflow

1. Generate each image with **Magnific**, **Google AI Studio**, or your preferred AI generator.
2. Use these prompts as a starting point:

| Slot | Prompt hint |
|------|-------------|
| Pita | *top-down shot of a single grilled pita flatbread on black, transparent background PNG* |
| Tzatziki | *top-down tzatziki spread on pita, white creamy sauce with cucumber, transparent PNG* |
| Gyros meat | *top-down shaved charcoal-grilled gyros meat pile, dark charred edges, transparent PNG* |
| Tomato | *top-down sliced ripe tomato on black, transparent PNG* |
| Onion | *top-down thin-sliced white onion strips, transparent PNG* |
| Wrapped pitogira | *top-down fully assembled and half-wrapped gyros pita, transparent PNG* |
| Skewer (×5) | *vertical grilled pork/chicken/lamb/mixed skewer on black, transparent PNG, portrait 1:3 ratio* |
| Salad tomato | *chunked ripe tomato piece, transparent PNG, square* |
| Salad cucumber | *cucumber slice, transparent PNG, square* |
| Salad olives | *three kalamata olives, transparent PNG, square* |
| Salad feta | *crumbled feta block, transparent PNG, square* |

3. Export as **transparent-background PNG** (no JPEG — alpha channel required for layering).
4. Drop the files here, matching the exact filenames:

```
public/
  ingredients/
    pita.png          ← top-down, ~1400×700px (2:1 landscape)
    tzatziki.png      ← same dimensions as pita
    meat.png          ← same dimensions as pita
    tomato.png        ← same dimensions as pita
    onion.png         ← same dimensions as pita
    wrap.png          ← same dimensions as pita
  kalamakia/
    skewer1.png       ← portrait, ~300×900px (1:3), pork
    skewer2.png       ← same dimensions, chicken
    skewer3.png       ← same dimensions, lamb
    skewer4.png       ← same dimensions, mixed
    skewer5.png       ← same dimensions, chef's special
  salad/
    tomato.png        ← square ~400×400px
    cucumber.png      ← square ~400×400px
    olives.png        ← square ~400×400px
    feta.png          ← square ~400×400px
```

The CSS gradient placeholders hide automatically once each PNG loads (via `onError` fallback — if the file is missing the gradient shows; if the file exists the PNG replaces it).

---

## Project structure

```
app/
  page.tsx                    ← root: wires all sections + SmoothScrollProvider
  layout.tsx                  ← fonts (Playfair Display + Inter), metadata
  globals.css                 ← Tailwind v4 theme tokens, Lenis CSS resets
  components/
    SmoothScrollProvider.tsx  ← Lenis instance, GSAP ticker integration
    EmberCanvas.tsx           ← Canvas particle system (hero + CTA bg)
  sections/
    HeroSection.tsx           ← Full-screen title reveal, ember BG
    PitogiraSection.tsx       ← PINNED section — ingredient stack ScrollTrigger
    KalamaSection.tsx         ← 5 skewers fly in on scroll
    SalatesSection.tsx        ← Salad ingredients fall into bowl
    MenuCTASection.tsx        ← Glowing amber CTA button
    FooterSection.tsx         ← Address, phone, brand mark
```

## Animation overview

| Section | Technique |
|---------|-----------|
| Hero title | GSAP timeline, `yPercent` stagger on mount |
| Ember particles | Canvas `requestAnimationFrame` loop |
| Pitogira | `ScrollTrigger` pin + scrub timeline (700 vh scroll distance) |
| Kalamakia | `ScrollTrigger` with `toggleActions`, staggered `y` fly-in |
| Salates | `ScrollTrigger` with `bounce.out` ease per ingredient |
| CTA button | GSAP `repeat: -1` glow pulse |

## Customising scroll feel

In `SmoothScrollProvider.tsx`, change the `lerp` value:
- `0.04` → very dreamy / slow
- `0.08` → current (cinematic)
- `0.15` → snappier

The Pitogira pin duration is controlled by `end: '+=700%'` in `PitogiraSection.tsx` — increase/decrease the percentage to slow or speed the build sequence.
