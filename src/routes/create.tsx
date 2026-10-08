import { createFileRoute, Link } from '@tanstack/react-router'
import { WorldNav } from '../components/navigation/WorldNav'

export const Route = createFileRoute('/create')({ component: CreateWorld })

function CreateWorld() {
  return <main id="main" className="world-page create-world">
    <WorldNav world="create" />
    <div className="world-coordinate coordinate-top">FIELD NOTES / 02<br />IMAGES THAT STAY WITH YOU</div>
    <section className="world-hero">
      <div className="world-overline"><span>02 — THE VISION</span><span>IMAGE / MOTION / MEANING</span></div>
      <h1>DULITHA <span>/ CREATE</span></h1>
      <p className="world-statement">Ideas made visible<span>.</span><br />Stories shaped with intention.</p>
      <div className="world-bottom"><p>Photography, motion and strategy with a point of view.</p><Link to="/" className="world-cta">RETURN TO THE CORTEX <span>↗</span></Link></div>
    </section>
    <div className="creative-frame" aria-hidden="true"><div className="frame-sun" /><div className="frame-line" /><span>FRAME / 001</span><small>LIGHT · FORM · FEELING</small></div>
    <div className="world-status"><i /> CREATE MODE ACTIVE <span> / </span> SYSTEM 02</div>
  </main>
}
