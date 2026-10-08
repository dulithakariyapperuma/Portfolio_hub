import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export function WorldNav({ world }: { world: 'build' | 'create' }) {
  const [switching, setSwitching] = useState(false)
  const navigate = useNavigate()
  const other = world === 'build' ? 'create' : 'build'
  function switchWorld() {
    setSwitching(true)
    window.setTimeout(() => void navigate({ to: other === 'build' ? '/build' : '/create' }).finally(() => setSwitching(false)), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350)
  }
  return <header className={`world-nav world-nav-${world}`}>
    <Link to="/" className="wordmark">DULITHA KARIYAPPERUMA<span>INDEPENDENT DEVELOPER & CREATIVE</span></Link>
    <nav><Link to="/build" aria-current={world === 'build' ? 'page' : undefined}>BUILD</Link><Link to="/create" aria-current={world === 'create' ? 'page' : undefined}>CREATE</Link><button type="button" onClick={switchWorld} aria-label={`Switch to ${other} hemisphere`}>◎ <span>SWITCH HEMISPHERE</span></button></nav>
    {switching && <span className="switch-wash" aria-hidden="true" />}
  </header>
}
