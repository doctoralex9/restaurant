'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const TITLE = 'ΣΧΑΡΑ'

export default function HeroSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ruleRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const letters = titleRef.current?.querySelectorAll<HTMLSpanElement>('.hero-letter')
    if (!letters || letters.length === 0) return

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo(
      letters,
      { yPercent: 115, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.09 }
    )
      .fromTo(
        ruleRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
        '-=0.5'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.4'
      )
      .fromTo(
        arrowRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      )

    // Endless bob
    gsap.to(arrowRef.current, {
      y: 14,
      duration: 1.3,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
      delay: 2,
    })
  }, [])

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Vignette / bottom fade */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-linear-to-t from-background via-background/20 to-transparent" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-radial-[ellipse_at_center] from-transparent to-background/60" />

      {/* Content */}
      <div className="relative z-20 text-center select-none px-4">
        {/* Title letters with overflow clip for reveal */}
        <div
          ref={titleRef}
          className="flex justify-center items-end"
          aria-label={TITLE}
        >
          {TITLE.split('').map((ch, i) => (
            <span
              key={i}
              className="hero-letter inline-block leading-none"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 900,
                fontSize: 'clamp(5rem, 18vw, 16rem)',
                color: '#f59e0b',
                letterSpacing: '-0.02em',
                textShadow: '0 0 80px rgba(245,158,11,0.35)',
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Amber rule */}
        <div
          ref={ruleRef}
          className="h-px w-32 mx-auto mt-4 mb-5"
          style={{ background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }}
        />

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-sm md:text-base tracking-[0.35em] uppercase text-white/50 font-light"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Ψητά στα κάρβουνα από το 1987
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={arrowRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <span
          className="text-[10px] tracking-[0.4em] uppercase text-white/25"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Scroll
        </span>
        <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
          <line x1="9" y1="0" x2="9" y2="22" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
          <polyline points="3,16 9,22 15,16" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
