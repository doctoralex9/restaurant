'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ------------------------------------------------------------------
// Swap each src with a real transparent PNG of the ingredient.
// Recommended: ~300×300px each, transparent background.
// ------------------------------------------------------------------
const INGREDIENTS = [
  {
    id: 'tomato',
    label: 'Τοματα',
    src: '/salad/tomato.png',
    color: '#DC2626',
    lightColor: '#FCA5A5',
    startX: '-20%',
    startDelay: 0,
  },
  {
    id: 'cucumber',
    label: 'Αγγούρι',
    src: '/salad/cucumber.png',
    color: '#16A34A',
    lightColor: '#86EFAC',
    startX: '10%',
    startDelay: 0.12,
  },
  {
    id: 'olives',
    label: 'Ελιές',
    src: '/salad/olives.png',
    color: '#1C1917',
    lightColor: '#44403C',
    startX: '-5%',
    startDelay: 0.24,
  },
  {
    id: 'feta',
    label: 'Φέτα',
    src: '/salad/feta.png',
    color: '#F0EDE6',
    lightColor: '#FAFAF8',
    startX: '15%',
    startDelay: 0.36,
  },
]

// Placeholder shapes for each ingredient
const SHAPES: Record<string, React.FC<{ color: string; lightColor: string }>> = {
  tomato: ({ color, lightColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="55" r="35" fill={color} />
      <ellipse cx="50" cy="52" rx="25" ry="20" fill={lightColor} opacity="0.3" />
      <line x1="50" y1="20" x2="50" y2="35" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  cucumber: ({ color, lightColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="55" rx="28" ry="38" fill={color} />
      <ellipse cx="50" cy="55" rx="18" ry="28" fill={lightColor} opacity="0.3" />
      {[0, 1, 2].map(i => (
        <line key={i} x1="32" y1={40 + i * 12} x2="68" y2={40 + i * 12} stroke={lightColor} strokeWidth="1.5" opacity="0.6" />
      ))}
    </svg>
  ),
  olives: ({ color, lightColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[0, 1, 2].map(i => (
        <ellipse key={i} cx={30 + i * 20} cy={50 + (i % 2 ? -8 : 8)} rx="12" ry="16" fill={color} stroke={lightColor} strokeWidth="1" opacity={0.9 - i * 0.05} />
      ))}
      {[0, 1, 2].map(i => (
        <ellipse key={i} cx={30 + i * 20} cy={50 + (i % 2 ? -8 : 8)} rx="5" ry="6" fill="#D4A820" opacity="0.8" />
      ))}
    </svg>
  ),
  feta: ({ color, lightColor }) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="18" y="40" width="64" height="30" rx="4" fill={color} stroke="#D0CCC4" strokeWidth="1" />
      <rect x="18" y="40" width="64" height="8" rx="4" fill={lightColor} opacity="0.5" />
      {[0, 1].map(i => (
        <line key={i} x1={38 + i * 24} y1="40" x2={38 + i * 24} y2="70" stroke="#D0CCC4" strokeWidth="0.8" opacity="0.6" />
      ))}
    </svg>
  ),
}

export default function SalatesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bowlRef = useRef<HTMLDivElement>(null)
  const ingredientRefs = useRef<(HTMLDivElement | null)[]>([])
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Bowl fades in
      gsap.fromTo(
        bowlRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Ingredients fall from above, each landing into the bowl
      ingredientRefs.current.forEach((el, i) => {
        if (!el) return
        const ing = INGREDIENTS[i]
        gsap.fromTo(
          el,
          { y: -320, x: ing.startX, opacity: 0, rotation: (i % 2 === 0 ? -20 : 20) },
          {
            y: 0, x: 0, opacity: 1, rotation: 0,
            duration: 0.9,
            ease: 'bounce.out',
            delay: ing.startDelay,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#080808] flex flex-col items-center justify-center py-28 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, #f59e0b40, transparent)' }} />

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-14 z-10" style={{ opacity: 0 }}>
        <p
          className="text-[10px] tracking-[0.5em] uppercase text-amber-500/50 mb-3"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Φρέσκα υλικά
        </p>
        <h2
          className="text-5xl md:text-7xl font-black text-white"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Σαλάτες
        </h2>
      </div>

      {/* Bowl + ingredients */}
      <div className="relative w-full max-w-lg mx-auto px-4" style={{ aspectRatio: '4/3' }}>
        {/* Bowl (always visible, ingredients fall into it) */}
        <div
          ref={bowlRef}
          className="absolute inset-0 flex items-end justify-center"
          style={{ opacity: 0, zIndex: 0 }}
        >
          <svg viewBox="0 0 400 280" className="w-full" fill="none">
            {/* Bowl body */}
            <path
              d="M 40 80 Q 40 240 200 260 Q 360 240 360 80"
              fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="2"
            />
            {/* Bowl rim */}
            <ellipse cx="200" cy="80" rx="160" ry="30" fill="#222" stroke="#333" strokeWidth="2" />
            {/* Subtle inner shadow */}
            <path
              d="M 60 90 Q 60 230 200 248 Q 340 230 340 90"
              fill="none" stroke="#2D2D2D" strokeWidth="1"
            />
          </svg>
        </div>

        {/* Falling ingredients */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
          <div className="relative w-56 h-56">
            {INGREDIENTS.map((ing, i) => {
              const ShapeComp = SHAPES[ing.id]
              return (
                <div
                  key={ing.id}
                  ref={el => { ingredientRefs.current[i] = el }}
                  className="absolute"
                  style={{
                    opacity: 0,
                    width: 80,
                    height: 80,
                    top: `${20 + Math.floor(i / 2) * 45}%`,
                    left: `${(i % 2 === 0 ? 5 : 55)}%`,
                  }}
                >
                  {/* Real PNG */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ing.src}
                    alt={ing.label}
                    className="absolute inset-0 w-full h-full object-contain"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                  {/* Placeholder shape */}
                  <div className="absolute inset-0">
                    <ShapeComp color={ing.color} lightColor={ing.lightColor} />
                  </div>
                  {/* Label */}
                  <p
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] tracking-widest uppercase whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-inter)', color: ing.color }}
                  >
                    {ing.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px"
           style={{ background: 'linear-gradient(90deg, transparent, #f59e0b40, transparent)' }} />
    </section>
  )
}
