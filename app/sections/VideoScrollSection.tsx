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

// Object-fit: contain — video centred, white letterbox for uncovered area
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
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      return;
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

    // Video — currentTime driven by scroll, never plays
    const video = document.createElement('video')
    video.src         = '/souvlaki.mp4'
    video.muted       = true
    video.playsInline = true
    video.preload     = 'auto'
    video.currentTime = 0

    // Three.js — opaque white background
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setClearColor(0xffffff, 1)
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

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG })
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

    let raf: number
    const tick = () => {
      texture.needsUpdate = true
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    video.addEventListener('loadedmetadata', () => {
      uniforms.uVidAspect.value = video.videoWidth / video.videoHeight

      // Prime the browser's video decoder so frame-accurate seeking works
      video.play()
        .then(() => { video.pause(); video.currentTime = 0 })
        .catch(() => {})

      // Tween a plain proxy — browsers throttle direct currentTime tweening
      const dur   = video.duration
      const proxy = { time: 0 }
      gsap.to(proxy, {
        time: dur,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   0.5,
        },
        onUpdate() {
          video.currentTime = proxy.time
        },
      })
    })
    video.load()

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      renderer.setSize(w, h)
      uniforms.uWinAspect.value = w / h
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      window.removeEventListener('resize', onResize)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} style={{ height: '500vh' }} className="relative bg-white">
      <div className="sticky top-0 h-screen overflow-hidden bg-white">

        {/* Three.js canvas */}
        <div ref={mountRef} className="absolute inset-0" />

        {/* Soft white vignette — blends video edges into white background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 65% 80% at center, transparent 40%, rgba(255,255,255,0.92) 88%)',
          }}
        />

        {/* Product name */}
        <div className="absolute inset-x-0 bottom-14 flex flex-col items-center pointer-events-none z-10">
          <h2
            className="text-5xl md:text-6xl font-black text-zinc-900"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Το Πιτόγυρο
          </h2>
        </div>
      </div>
    </section>
  )
}
