import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function BrainParticles({ count = 420 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 1.8 + Math.random() * 2.3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      values[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      values[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      values[i * 3 + 2] = radius * Math.cos(phi)
    }
    return values
  }, [count])
  useFrame(({ clock }, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.018 + Math.sin(clock.elapsedTime) * 0.0004 })
  return <points ref={ref}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <pointsMaterial color="#d9ddd3" size={0.012} transparent opacity={0.48} sizeAttenuation depthWrite={false} />
  </points>
}
