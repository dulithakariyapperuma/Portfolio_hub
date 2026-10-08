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

  return (
    <>
      {/* Ambient pinkish-white light to illuminate translucent tissue */}
      <ambientLight intensity={0.95} color="#ffd1dc" />

      {/* Main warm peach key light on left (matching warm orange left glow in reference image) */}
      <directionalLight position={[-5, 3.5, 4]} intensity={3.8} color="#ffb27d" />

      {/* Cold icy cyan rim light on right (matching bright cyan rim light in reference image) */}
      <directionalLight position={[5, 4.5, -2]} intensity={4.5} color="#38bdf8" />

      {/* Top soft specular highlight light */}
      <directionalLight position={[0, 6, 2]} intensity={2.2} color="#ffffff" />

      {/* Bottom fill light for smooth lower cerebrum shadow details */}
      <directionalLight position={[0, -4, 3]} intensity={1.1} color="#f472b6" />

      {/* Dynamic hemisphere interactive highlight point lights */}
      <pointLight position={[-2.5, 0.4, 2]} intensity={active === 'build' ? 16 : 4} distance={8} color="#ff7b54" />
      <pointLight position={[2.5, 0.1, 2]} intensity={active === 'create' ? 16 : 4} distance={8} color="#38bdf8" />

      <Float speed={0.5} rotationIntensity={0.04} floatIntensity={0.08}>
        <BrainModel active={active} pointer={pointer} />
      </Float>

      <BrainParticles count={typeof window !== 'undefined' && window.innerWidth < 700 ? 180 : 420} />

      {rings.map((ring, index) => (
        <Line key={index} points={ring.points} color="#f472b6" transparent opacity={ring.opacity} lineWidth={0.55} />
      ))}
    </>
  )
}

export { BrainPlaceholder }
