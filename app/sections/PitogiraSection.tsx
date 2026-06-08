'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ------------------------------------------------------------------
// Swap these PNGs with real AI-generated transparent food photos.
// All images should be transparent-background PNGs, ~1200×600px,
// top-down view of each ingredient centered in frame.
// ------------------------------------------------------------------
const INGREDIENTS = [
  {
    id: 'pita',
    label: 'ΠΙΤΑ',
    sublabel: 'Pita Bread',
    src: '/ingredients/pita.png',
    // Placeholder style when PNG is absent
    placeholderBg: 'radial-gradient(ellipse 85% 55% at 50% 50%, #C8A87A 0%, #8B6035 80%, transparent 100%)',
    initFrom: { y: 60, opacity: 0 },
  },
  {
    id: 'tzatziki',
    label: 'ΤΖΑΤΖΙΚΙ',
    sublabel: 'Tzatziki',
    src: '/ingredients/tzatziki.png',
    placeholderBg: 'radial-gradient(ellipse 65% 40% at 50% 55%, #F0EDE6 0%, #C8C4BC 80%, transparent 100%)',
    initFrom: { scale: 0.7, opacity: 0 },
  },
  {
    id: 'meat',
    label: 'ΓΥΡΟΣ',
    sublabel: 'Grilled Meat',
    src: '/ingredients/meat.png',
    placeholderBg: 'radial-gradient(ellipse 50% 45% at 50% 52%, #4A2A1A 0%, #2A1008 70%, transparent 100%)',
    initFrom: { y: -80, opacity: 0 },
  },
  {
    id: 'tomato',
    label: 'ΤΟΜΑΤΑ',
    sublabel: 'Tomato',
    src: '/ingredients/tomato.png',
    placeholderBg: 'radial-gradient(ellipse 55% 35% at 45% 52%, #DC2626 0%, #991B1B 75%, transparent 100%)',
    initFrom: { x: -100, opacity: 0 },
  },
  {
    id: 'onion',
    label: 'ΚΡΕΜΜΥΔΙ',
    sublabel: 'Onion',
    src: '/ingredients/onion.png',
    placeholderBg: 'radial-gradient(ellipse 50% 30% at 55% 50%, #E8E4F0 0%, #B8B0D0 75%, transparent 100%)',
    initFrom: { x: 100, opacity: 0 },
  },
  {
    id: 'wrap',
    label: 'ΤΥΛΙΓΜΑ',
    sublabel: 'Wrapped Pitogira',
    src: '/ingredients/wrap.png',
    placeholderBg: 'radial-gradient(ellipse 45% 70% at 50% 50%, #C8A87A 0%, #7A5030 60%, transparent 100%)',
    initFrom: { scale: 0.85, rotation: -8, opacity: 0 },
  },
]

// Steps where ingredient labels appear/disappear (timeline position fractions, 0–1)
const LABEL_IN  = [0.02, 0.18, 0.34, 0.50, 0.66, 0.82]
const LABEL_OUT = [0.16, 0.32, 0.48, 0.64, 0.80, 1.00]

export default function PitogiraSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const layerRefs  = useRef<(HTMLDivElement | null)[]>([])
  const labelRefs  = useRef<(HTMLDivElement | null)[]>([])
  const plateRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hide all layers initially
      layerRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { ...INGREDIENTS[i].initFrom, opacity: 0 })
      })
      labelRefs.current.forEach(el => {
        if (el) gsap.set(el, { opacity: 0, y: 18 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=700%',
          scrub: 1.8,
          pin: true,
          anticipatePin: 1,
        },
      })

      // --- Plate/stage fades in first ---
      tl.fromTo(plateRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5 })

      // --- Each ingredient: appear, then its label in / out ---
      const step = 1     // timeline duration unit per ingredient
      const gap  = 0.25

      INGREDIENTS.forEach((ing, i) => {
        const start = 0.5 + i * (step + gap)
        const el    = layerRefs.current[i]
        const lbl   = labelRefs.current[i]

        // Ingredient reveal
        tl.to(el, {
          ...Object.fromEntries(
            Object.keys(ing.initFrom).map(k => [k, k === 'opacity' ? 1 : k === 'rotation' ? 0 : 0])
          ),
          opacity: 1,
          duration: step,
          ease: 'power3.out',
        }, start)

        // Label in
        tl.to(lbl, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, start + 0.4)

        // Label out (except last)
        if (i < INGREDIENTS.length - 1) {
          tl.to(lbl, { opacity: 0, y: -14, duration: 0.25 }, start + step + gap - 0.25)
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0a]">
      {/* The pinned inner viewport */}
      <div className="h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Section title */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none">
          <p
            className="text-[10px] tracking-[0.5em] uppercase text-amber-500/50 mb-2"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            The Signature
          </p>
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Πιτόγυρα
          </h2>
        </div>

        {/* Ingredient stack plate */}
        <div
          ref={plateRef}
          className="relative w-full max-w-[680px] aspect-[2/1] mx-auto"
          style={{ opacity: 0 }}
        >
          {INGREDIENTS.map((ing, i) => (
            <div
              key={ing.id}
              ref={el => { layerRefs.current[i] = el }}
              className="absolute inset-0"
              style={{ zIndex: i + 1 }}
            >
              {/* Real PNG (transparent, swap in from AI generator) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ing.src}
                alt={ing.sublabel}
                className="absolute inset-0 w-full h-full object-contain"
                // If PNG doesn't exist yet, the placeholder gradient below shows
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              {/* CSS gradient placeholder — visible until real PNG is placed */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{ background: ing.placeholderBg }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Ingredient name label — one per ingredient, same absolute position */}
        <div className="relative h-16 flex items-center justify-center mt-6">
          {INGREDIENTS.map((ing, i) => (
            <div
              key={ing.id}
              ref={el => { labelRefs.current[i] = el }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              style={{ opacity: 0 }}
            >
              <span
                className="text-2xl md:text-3xl font-black text-amber-400 tracking-wide"
                style={{ fontFamily: 'var(--font-playfair)', textShadow: '0 0 30px rgba(245,158,11,0.5)' }}
              >
                {ing.label}
              </span>
              <span
                className="text-[11px] tracking-[0.3em] uppercase text-white/35 mt-1"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {ing.sublabel}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {INGREDIENTS.map((ing, i) => (
            <div
              key={ing.id}
              className="w-1 h-1 rounded-full bg-white/20"
              style={{ transition: 'background 0.3s' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
