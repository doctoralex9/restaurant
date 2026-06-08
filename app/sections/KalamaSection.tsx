'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ------------------------------------------------------------------
// Swap each src with a real transparent PNG of a grilled skewer.
// Recommended size: ~180×600px, portrait orientation, transparent bg.
// ------------------------------------------------------------------
const SKEWERS = [
  { id: 'sk1', src: '/kalamakia/skewer1.png', label: 'Χοιρινό', sublabel: 'Pork' },
  { id: 'sk2', src: '/kalamakia/skewer2.png', label: 'Κοτόπουλο', sublabel: 'Chicken' },
  { id: 'sk3', src: '/kalamakia/skewer3.png', label: 'Αρνί', sublabel: 'Lamb' },
  { id: 'sk4', src: '/kalamakia/skewer4.png', label: 'Μικτό', sublabel: 'Mixed' },
  { id: 'sk5', src: '/kalamakia/skewer5.png', label: 'Σεφ', sublabel: "Chef's Special" },
]

// Alternating entry directions
const FROM_DIRS = ['top', 'bottom', 'top', 'bottom', 'top']

export default function KalamaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const skewerRefs = useRef<(HTMLDivElement | null)[]>([])
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: false,
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Each skewer flies in from top or bottom, staggered
      skewerRefs.current.forEach((el, i) => {
        if (!el) return
        const fromTop = FROM_DIRS[i] === 'top'

        gsap.fromTo(
          el,
          { y: fromTop ? -400 : 400, opacity: 0, rotate: fromTop ? -8 : 8 },
          {
            y: 0, opacity: 1, rotate: 0,
            duration: 1.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              end: 'top 20%',
              scrub: false,
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.14,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center py-28 overflow-hidden"
    >
      {/* Subtle horizontal rule gradient top */}
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, #f59e0b40, transparent)' }} />

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-16 md:mb-20 z-10">
        <p
          className="text-[10px] tracking-[0.5em] uppercase text-amber-500/50 mb-3"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Από τη σχάρα
        </p>
        <h2
          className="text-5xl md:text-7xl font-black text-white"
          style={{ fontFamily: 'var(--font-playfair)', textShadow: '0 0 60px rgba(245,158,11,0.2)' }}
        >
          Καλαμάκια
        </h2>
        <p
          className="mt-4 text-sm tracking-[0.25em] uppercase text-white/35"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          στα κάρβουνα
        </p>
      </div>

      {/* Skewer row */}
      <div className="flex items-end justify-center gap-6 md:gap-10 w-full max-w-4xl px-4">
        {SKEWERS.map((sk, i) => (
          <div
            key={sk.id}
            ref={el => { skewerRefs.current[i] = el }}
            className="flex flex-col items-center gap-3 flex-1 max-w-[120px] md:max-w-[150px]"
            style={{ opacity: 0 }}
          >
            {/* Skewer visual */}
            <div className="relative w-full" style={{ aspectRatio: '1/3.8' }}>
              {/* Real PNG placeholder */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sk.src}
                alt={sk.sublabel}
                className="absolute inset-0 w-full h-full object-contain"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              {/* CSS placeholder: stick + meat chunks */}
              <div className="absolute inset-0 flex flex-col items-center justify-end gap-0" aria-hidden="true">
                {/* Skewer stick */}
                <div
                  className="absolute inset-x-1/2 top-0 bottom-0 -translate-x-1/2 w-[3px] rounded-full"
                  style={{ background: 'linear-gradient(180deg, #9CA3AF 0%, #6B7280 50%, #4B5563 100%)' }}
                />
                {/* Meat chunks */}
                {[0, 1, 2, 3].map(j => (
                  <div
                    key={j}
                    className="absolute w-[82%] rounded-md"
                    style={{
                      top: `${10 + j * 22}%`,
                      height: '18%',
                      background: `linear-gradient(135deg, #4A2A1A ${j * 10}%, #6B3D2A, #3A1A0A)`,
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)',
                    }}
                  />
                ))}
                {/* Tip */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[3px] h-[8%] rounded-b-full"
                  style={{ background: '#D1D5DB' }}
                />
              </div>
            </div>

            {/* Label */}
            <div className="text-center">
              <p
                className="text-sm md:text-base font-bold text-amber-400"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {sk.label}
              </p>
              <p
                className="text-[10px] tracking-widest uppercase text-white/30 mt-0.5"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {sk.sublabel}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, #f59e0b40, transparent)' }} />
    </section>
  )
}
