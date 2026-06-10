'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Object-fit: contain. Letterbox areas → transparent so CSS gradient shows through.
const FRAG = `
  uniform sampler2D uVideo;
  uniform float uWinAspect;
  uniform float uVidAspect;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv - 0.5;
    float r = uVidAspect / uWinAspect;
    if (r < 1.0) uv.x *= r; else uv.y /= r;
    uv += 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      discard;
    }
    gl_FragColor = texture2D(uVideo, uv);
  }
`

export default function VideoScrollSection() {
  const mountRef   = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const mount   = mountRef.current!
    const section = sectionRef.current!

    // ── Video (off-DOM) ───────────────────────────────────────
    const video = document.createElement('video')
    video.src         = '/souvlaki.mp4'
    video.muted       = true
    video.playsInline = true
    video.preload     = 'auto'
    video.currentTime = 0

    // ── Three.js (alpha so CSS gradient is visible behind letterbox) ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const texture = new THREE.VideoTexture(video)
    texture.minFilter  = THREE.LinearFilter
    texture.magFilter  = THREE.LinearFilter
    texture.colorSpace = THREE.SRGBColorSpace

    const uniforms = {
      uVideo:     { value: texture },
      uWinAspect: { value: mount.clientWidth / mount.clientHeight },
      uVidAspect: { value: 1.0 },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:   VERT,
      fragmentShader: FRAG,
      transparent:    true,   // required for discard to composite correctly
    })
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

    // ── Render loop ───────────────────────────────────────────
    let raf: number
    const tick = () => {
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    // The key fix: only mark texture dirty AFTER the seek completes.
    // During a seek, readyState drops and the frame isn't decoded yet;
    // setting needsUpdate then would upload a stale or blank frame.
    const onSeeked = () => { texture.needsUpdate = true }
    video.addEventListener('seeked', onSeeked)

    // ── ScrollTrigger (created once metadata is loaded) ───────
    const ctx = gsap.context(() => {}, section)

    const setup = () => {
      uniforms.uVidAspect.value = video.videoWidth / video.videoHeight
      texture.needsUpdate = true   // show frame 0 immediately

      // Prime the decoder so first seek is instant
      video.play()
        .then(() => { video.pause(); video.currentTime = 0 })
        .catch(() => {})

      const dur = video.duration

      ctx.add(() => {
        ScrollTrigger.create({
          trigger: section,
          start:   'top top',
          end:     'bottom bottom',
          onUpdate(self) {
            // progress goes 0→1 scrolling down, 1→0 scrolling up → video plays both directions
            video.currentTime = self.progress * dur
          },
        })
      })
    }

    if (video.readyState >= 1) {
      setup()
    } else {
      video.addEventListener('loadedmetadata', setup, { once: true })
    }
    video.load()

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      renderer.setSize(w, h)
      uniforms.uWinAspect.value = w / h
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
      video.removeEventListener('seeked', onSeeked)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section ref={sectionRef} style={{ height: '500vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Gradient background — visible through the transparent letterbox areas */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #ffffff 0%, #fdf8f2 25%, #f7ede0 55%, #fdf8f2 80%, #ffffff 100%)',
          }}
        />

        {/* Three.js canvas (alpha: true, so gradient shows through letterbox) */}
        <div ref={mountRef} className="absolute inset-0" />

        {/* Soft vignette fading into gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 75% 85% at 50% 48%, transparent 38%, rgba(253,248,242,0.7) 72%, rgba(255,255,255,0.95) 88%)',
          }}
        />

        {/* Headline */}
        <div className="absolute inset-x-0 bottom-16 flex flex-col items-center pointer-events-none z-10">
          <p
            className="mb-3 text-[10px] tracking-[0.5em] uppercase text-zinc-400"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Scroll to explore
          </p>
          <h2
            className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Το Πιτόγυρο
          </h2>
        </div>

      </div>
    </section>
  )
}
