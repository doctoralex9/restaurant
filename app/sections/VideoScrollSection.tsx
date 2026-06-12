'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TOTAL_FRAMES = 181
const frameSrc = (n: number) => `/ezgif-frame-${String(n).padStart(3, '0')}.png`

// Measured crop: 1920×1080 frames have ~413px black bars on each side
const CROP = { x: 413, y: 0, w: 1094, h: 1080 }

export default function VideoScrollSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let currentFrame = 0

    function paint(index: number) {
      let img = images[index]
      // Fall back to nearest earlier loaded frame
      if (!img?.complete || !img.naturalWidth) {
        for (let k = index - 1; k >= 0; k--) {
          if (images[k]?.complete && images[k].naturalWidth) { img = images[k]; break }
        }
        if (!img?.complete || !img.naturalWidth) return
      }

      const W = window.innerWidth
      const H = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      const PW = W * dpr
      const PH = H * dpr

      canvas.width = PW
      canvas.height = PH

      const scale = Math.max(PW / CROP.w, PH / CROP.h)
      const dw = CROP.w * scale
      const dh = CROP.h * scale

      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, PW, PH)
      ctx.drawImage(img, CROP.x, CROP.y, CROP.w, CROP.h, (PW - dw) / 2, (PH - dh) / 2, dw, dh)
    }

    // Set onload BEFORE src so it fires even on a cache hit
    const images = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const img = new Image()
      img.onload = () => { if (i <= currentFrame) paint(currentFrame) }
      img.src = frameSrc(i + 1)
      return img
    })

    // Immediate draw if frame 0 is already in cache
    if (images[0].complete && images[0].naturalWidth) paint(0)

    const gsapCtx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=500%',
        pin: true,
        scrub: 0.5,
        onUpdate(self) {
          const next = Math.min(TOTAL_FRAMES - 1, Math.round(self.progress * (TOTAL_FRAMES - 1)))
          if (next !== currentFrame) {
            currentFrame = next
            paint(next)
          }
        },
      })
    }, sectionRef)

    const onResize = () => { canvas.width = 0; paint(currentFrame) }
    window.addEventListener('resize', onResize)

    return () => {
      gsapCtx.revert()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section ref={sectionRef} style={{ width: '100%', height: '100vh' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </section>
  )
}
