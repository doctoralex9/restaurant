'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TITLE = 'ΣΧΑΡΑ'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const letters = Array.from(
      titleRef.current?.querySelectorAll<HTMLSpanElement>('.hero-letter') ?? []
    )
    if (!letters.length) return

    const ctx = gsap.context(() => {
      // Entry — fade up from below; y-based so no font-height dependency
      gsap.fromTo(
        letters,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.3, stagger: 0.08, ease: 'power3.out', clearProps: 'y' }
      )

      // Fade + lift out as hero scrolls away
      gsap.to(letters, {
        opacity: 0,
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end:   'bottom top',
          scrub: 0.6,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center bg-white overflow-hidden"
    >
      <div
        ref={titleRef}
        className="flex justify-center items-end select-none px-4"
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
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    </section>
  )
}
