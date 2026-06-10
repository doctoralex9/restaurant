'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function MenuCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const btnRef     = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.fromTo(textRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
        .fromTo(btnRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.4')

      // Pulse glow on button
      gsap.to(btnRef.current, {
        boxShadow: '0 0 50px rgba(245,158,11,0.6), 0 0 100px rgba(245,158,11,0.2)',
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] bg-white flex flex-col items-center justify-center py-28 overflow-hidden"
    >
      <div className="relative z-10 text-center px-4">
        <div ref={textRef} style={{ opacity: 0 }}>
          <p
            className="text-[10px] tracking-[0.5em] uppercase text-amber-500 mb-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Ανακάλυψε
          </p>
          <h2
            className="text-5xl md:text-7xl font-black text-zinc-900 mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Δες το μενού μας
          </h2>
          <p
            className="text-sm md:text-base text-zinc-500 tracking-[0.2em] uppercase max-w-sm mx-auto mb-10"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Φρέσκα υλικά · Ανοιχτή φωτιά · Αυθεντικές γεύσεις
          </p>
        </div>

        {/* CTA button */}
        <a
          ref={btnRef}
          href="#menu"
          className="inline-block px-10 py-4 text-sm tracking-[0.25em] uppercase font-medium text-white rounded-none"
          style={{
            fontFamily: 'var(--font-inter)',
            background: '#f59e0b',
            boxShadow: '0 0 30px rgba(245,158,11,0.4)',
            opacity: 0,
          }}
        >
          Δες το Μενού
        </a>
      </div>
    </section>
  )
}
