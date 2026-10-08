import { useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const BrainScene = lazy(() => import('./BrainScene'))

type Hemisphere = 'build' | 'create'
const details = {
  build: { word: 'LOGIC', label: 'ENTER THE LOGIC', subtitle: 'Software · Web · AI · Digital Products', detected: 'LEFT HEMISPHERE DETECTED', words: ['BUILD', 'SYSTEMS', 'INTERFACES', 'PRODUCTS', 'AUTOMATION'] },
  create: { word: 'VISION', label: 'ENTER THE VISION', subtitle: 'Photography · Content · Motion · Direction', detected: 'RIGHT HEMISPHERE DETECTED', words: ['FRAME', 'STORY', 'MOTION', 'BRAND', 'GROW'] },
}

export function BrainInterface() {
  const navigate = useNavigate()
  const [active, setActive] = useState<Hemisphere | null>(null)
  const [explored, setExplored] = useState<Hemisphere[]>([])
  const [intro, setIntro] = useState(false)
  const [introDone, setIntroDone] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const prefersReducedMotion = useRef(false)
  const busy = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReducedMotion.current)
    try {
      if (!localStorage.getItem('cortex-intro-seen')) {
        setIntro(true)
        setIntroDone(false)
        const timer = window.setTimeout(() => {
          setIntro(false)
          setIntroDone(true)
          localStorage.setItem('cortex-intro-seen', '1')
        }, prefersReducedMotion.current ? 100 : 1350)
        return () => window.clearTimeout(timer)
      }
    } catch { /* Storage can be unavailable in private contexts. */ }
    setIntroDone(true)
  }, [])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') setActive('build')
      if (event.key === 'ArrowRight') setActive('create')
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'Enter' && active && (document.activeElement === document.body || document.activeElement?.getAttribute('data-side'))) enter(active)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  function enter(side: Hemisphere) {
    setActive(side)
    if (!explored.includes(side)) setExplored((current) => [...current, side])
    if (busy.current) return
    busy.current = true
    const reduced = prefersReducedMotion.current
    document.documentElement.dataset.transition = side
    window.setTimeout(() => {
      void navigate({ to: side === 'build' ? '/build' : '/create' }).finally(() => {
        busy.current = false
        delete document.documentElement.dataset.transition
      })
    }, reduced ? 0 : 750)
  }

  const detail = active ? details[active] : null
  return <main id="main" className={`gateway ${active ? `is-${active}` : ''}`}>
    <div className="ambient ambient-left" /><div className="ambient ambient-right" />
    <header className="gateway-nav"><a className="wordmark" href="/">DULITHA KARIYAPPERUMA<span>INDEPENDENT DEVELOPER & CREATIVE</span></a><span className="edition">COLOMBO, LK <i /> DIGITAL PORTFOLIO / 2026</span></header>
    <section className="gateway-core" aria-label="Explore both sides of the portfolio">
      <div className="gateway-title"><p className="eyebrow">A CREATIVE PRACTICE IN TWO MODES</p><h1>TWO SIDES<span>.</span> ONE MIND<span>.</span></h1></div>
      <div className="scene-wrap"><div className="orbit-label orbit-top">CORTEX / 01 — 02</div><Suspense fallback={<div className="canvas-fallback" />}><BrainScene active={active} reducedMotion={reducedMotion} onPointer={(x) => { if (Math.abs(x) > 0.08) setActive(x < 0 ? 'build' : 'create') }} /></Suspense><div className="orbit-label orbit-bottom">MOVE TO EXPLORE <span>·</span> TAP A SIDE</div>
        <span className="axis axis-left">01 / BUILD</span><span className="axis axis-right">02 / CREATE</span>
      </div>
      <div className="side-controls">
        {(['build', 'create'] as const).map((side) => <button key={side} className={`side-control side-${side} ${active === side ? 'selected' : ''}`} data-side={side} onMouseEnter={() => setActive(side)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(side)} onBlur={() => setActive(null)} onClick={() => enter(side)} aria-label={`${details[side].label}. ${details[side].subtitle}`}>
          <span className="side-index">0{side === 'build' ? 1 : 2} / {side === 'build' ? 'STRUCTURE' : 'STORY'}</span><span className="side-name">{side === 'build' ? 'THE LOGIC' : 'THE VISION'}</span><span className="side-descriptor">{details[side].subtitle}</span><span className="side-action">{details[side].label} <span>↗</span></span>
        </button>)}
      </div>
    </section>
    <footer className="gateway-footer"><div className="signal"><span className="signal-dot" />{detail?.detected ?? 'NEURAL INTERFACE ONLINE'}<span className="signal-divider">/</span>SIGNAL {active ? 'ACTIVE' : 'IDLE'}</div><span className="footer-center">{detail ? detail.words.join(' · ') : 'SOFTWARE / IMAGE / SYSTEMS / STORY'}</span><span className="footer-right">{explored.length === 2 ? 'CORTEX LINK ESTABLISHED' : 'SELECT A HEMISPHERE'}</span></footer>
    {intro && <motion.div className="intro-overlay" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.45, delay: 0.85 }}><p>INITIALIZING</p><span className="intro-line" /><p>IDENTITY FOUND</p><strong>DULITHA KARIYAPPERUMA</strong><p>NEURAL INTERFACE ONLINE</p></motion.div>}
    {!introDone && <span className="sr-only" role="status">Initializing neural interface</span>}
  </main>
}
