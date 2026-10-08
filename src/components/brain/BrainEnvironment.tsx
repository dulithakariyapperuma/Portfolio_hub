import { Float, Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { BrainParticles } from './BrainParticles'
import { BrainModel } from './BrainModel'
import { BrainPlaceholder } from './BrainPlaceholder'

type Hemisphere = 'build' | 'create' | null

export function BrainEnvironment({ active, pointer }: { active: Hemisphere; pointer: React.RefObject<THREE.Vector2> }) {
  const rings = useMemo(() => Array.from({ length: 3 }, (_, index) => {
    const radius = 1.95 + index * 0.14
    const points = Array.from({ length: 129 }, (_, i) => {
      const angle = (i / 128) * Math.PI * 2
      return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.47, -0.45 - index * 0.06)
    })
    return { points, opacity: 0.12 - index * 0.025 }
  }), [])
  return <>
    <ambientLight intensity={0.62} />
    <directionalLight position={[-4, 3, 4]} intensity={2.4} color="#e0e2d8" />
    <directionalLight position={[2, -2, -3]} intensity={1.1} color="#78827d" />
    <pointLight position={[-2, 0.4, 1.7]} intensity={active === 'build' ? 19 : 6} distance={8} color="#75b7a8" />
    <pointLight position={[2, 0.1, 1.6]} intensity={active === 'create' ? 19 : 6} distance={8} color="#c38d67" />
    <Float speed={0.5} rotationIntensity={0.04} floatIntensity={0.08}><BrainModel active={active} pointer={pointer} /></Float>
    <BrainParticles count={typeof window !== 'undefined' && window.innerWidth < 700 ? 180 : 420} />
    {rings.map((ring, index) => <Line key={index} points={ring.points} color="#c7d2c8" transparent opacity={ring.opacity} lineWidth={0.55} />)}
  </>
}

export { BrainPlaceholder }
