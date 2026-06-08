'use client'
import { useEffect, useRef } from 'react'

interface Ember {
  x: number
  y: number
  size: number
  vx: number
  vy: number
  opacity: number
  life: number
  maxLife: number
  hue: number
}

const MAX_EMBERS = 70

function spawn(w: number, h: number): Ember {
  return {
    x: Math.random() * w,
    y: h + 5,
    size: Math.random() * 3.5 + 0.8,
    vx: (Math.random() - 0.5) * 0.9,
    vy: -(Math.random() * 1.4 + 0.5),
    opacity: 0,
    life: 0,
    maxLife: Math.random() * 180 + 90,
    hue: Math.random() > 0.6 ? 38 : Math.random() > 0.5 ? 25 : 45, // amber / orange / gold
  }
}

export default function EmberCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const embers: Ember[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Pre-seed embers at random life stages
    for (let i = 0; i < MAX_EMBERS; i++) {
      const e = spawn(canvas.width, canvas.height)
      e.life = Math.random() * e.maxLife
      e.y = canvas.height - e.life * Math.abs(e.vy)
      embers.push(e)
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.life++
        e.x += e.vx + Math.sin(e.life * 0.04) * 0.3
        e.y += e.vy

        const p = e.life / e.maxLife
        e.opacity = p < 0.15 ? p / 0.15 : p > 0.65 ? (1 - p) / 0.35 : 1

        const alpha = e.opacity * 0.85
        const color = `hsla(${e.hue}, 95%, 58%, ${alpha})`
        const glowColor = `hsla(${e.hue}, 95%, 58%, ${alpha * 0.35})`

        // Glow halo
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 4)
        grad.addColorStop(0, glowColor)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Core ember
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        if (e.life >= e.maxLife || e.y < -10) {
          embers[i] = spawn(canvas.width, canvas.height)
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
