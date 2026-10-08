import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { BrainEnvironment, BrainPlaceholder } from './BrainEnvironment'

type Hemisphere = 'build' | 'create' | null

export function BrainScene({ active, onPointer, reducedMotion }: { active: Hemisphere; onPointer: (x: number, y: number) => void; reducedMotion: boolean }) {
  const pointer = useRef(new THREE.Vector2())
  return <div className="brain-canvas" aria-hidden="true" onPointerMove={(event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    pointer.current.set(x, y)
    onPointer(x, y)
  }}>
    <Canvas frameloop={reducedMotion ? 'demand' : 'always'} dpr={[1, 1.5]} camera={{ position: [0, 0, 6.9], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={<div className="canvas-fallback" /> }>
      <Suspense fallback={<BrainPlaceholder />}><BrainEnvironment active={active} pointer={pointer} /></Suspense>
    </Canvas>
  </div>
}

export default BrainScene
