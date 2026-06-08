# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (also runs tsc)
npm run lint     # ESLint
npx tsc --noEmit # type-check without emitting
```

No test suite is configured. There is no `src/` directory — all app code lives directly under `app/`.

## Architecture

Single-page scroll demo. `app/page.tsx` is a server component that renders `<SmoothScrollProvider>` (client boundary) wrapping six section components in order. Every section is a `'use client'` component.

**Animation stack — how it hangs together:**

`SmoothScrollProvider` creates a single `Lenis` instance with `autoRaf: false` and drives it from `gsap.ticker`. This makes GSAP the single source of time for both smooth scroll and all ScrollTrigger scrubs. The critical wiring is:

```ts
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

Every section calls `gsap.registerPlugin(ScrollTrigger)` defensively (idempotent) and wraps all GSAP code in `gsap.context(() => { ... }, sectionRef)` — `ctx.revert()` in the cleanup handles killing ScrollTrigger instances and resetting inline styles.

**Pinned section (PitogiraSection):**
The outer `<section>` is the ScrollTrigger trigger with `pin: true` and `end: '+=700%'`. GSAP creates a spacer element automatically — do not add manual height to that element. The inner `h-screen` div is what actually gets pinned. The scrub timeline uses numeric position labels (e.g. `start = 0.5 + i * (step + gap)`) to sequence each ingredient layer.

**Image placeholder pattern:**
Each ingredient renders a real `<img>` tag referencing `/public/ingredients/[name].png`. An `onError` handler hides the `<img>` if the file is missing, exposing the CSS radial-gradient div behind it. When real PNGs are dropped into `public/`, they automatically take over — no code change needed.

## Fonts & theme tokens

Two Google Fonts loaded in `layout.tsx` via `next/font`:
- `--font-playfair` → Playfair Display (700/800/900) — headings, labels
- `--font-inter` → Inter (300/400/500) — subtitles, captions, tracking text

Both are referenced via CSS variables in inline `style` props (`fontFamily: 'var(--font-playfair)'`), not Tailwind utility classes, because Tailwind v4's `@theme` font token registration wasn't wired to class generation.

Tailwind v4 design tokens live in `globals.css` under `@theme inline`:
- `--color-amber: #f59e0b` → usable as `text-amber`, `bg-amber`
- `--color-background: #0a0a0a` → usable as `bg-background`

## Image asset map

Real food photos (transparent-background PNGs) go here — dropping the file in is all that's needed:

```
public/ingredients/   pita  tzatziki  meat  tomato  onion  wrap   (2:1 landscape, ~1400×700px)
public/kalamakia/     skewer1–5                                     (1:3 portrait, ~300×900px)
public/salad/         tomato  cucumber  olives  feta               (square, ~400×400px)
```

## Key tuning knobs

| What | Where | How |
|------|-------|-----|
| Scroll smoothness | `SmoothScrollProvider.tsx` | `lerp` (0.04 = dreamy, 0.15 = snappy) |
| Pitogira pin length | `PitogiraSection.tsx` | `end: '+=700%'` — raise % to slow the build |
| Scrub inertia | `PitogiraSection.tsx` | `scrub: 1.8` — higher = more lag behind scroll |
| Ember count | `EmberCanvas.tsx` | `MAX_EMBERS` constant |
| Ingredient sequence | `PitogiraSection.tsx` | `INGREDIENTS` array order; `initFrom` controls entry direction per layer |
