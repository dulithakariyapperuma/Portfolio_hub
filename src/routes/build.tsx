import { createFileRoute, Link } from '@tanstack/react-router'
import { WorldNav } from '../components/navigation/WorldNav'

export const Route = createFileRoute('/build')({ component: BuildWorld })

function BuildWorld() {
  return <main id="main" className="world-page build-world">
    <WorldNav world="build" />
    <div className="world-coordinate coordinate-top">FIELD NOTES / 01<br />SYSTEMS THAT FEEL HUMAN</div>
    <section className="world-hero">
      <div className="world-overline"><span>01 — THE LOGIC</span><span>SOFTWARE / SYSTEMS / PRODUCTS</span></div>
      <h1>DULITHA <span>/ BUILD</span></h1>
      <p className="world-statement">I build digital products,<br />interfaces and intelligent systems<span>.</span></p>
      <div className="world-bottom"><p>Turning complex ideas into useful, thoughtful experiences.</p><Link to="/" className="world-cta">RETURN TO THE CORTEX <span>↗</span></Link></div>
    </section>
    <div className="world-grid" aria-hidden="true" /><div className="world-status"><i /> BUILD MODE ACTIVE <span> / </span> SYSTEM 01</div>
  </main>
}
