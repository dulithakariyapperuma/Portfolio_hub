import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function BrainPlaceholder() {
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock }, delta) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.08
      group.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.05
    }
  })
  return <group ref={group}>
    <mesh position={[-0.46, 0, 0]} scale={[0.9, 1.05, 0.78]}><icosahedronGeometry args={[1, 4]} /><meshStandardMaterial color="#9bbcb5" metalness={0.72} roughness={0.3} wireframe /></mesh>
    <mesh position={[0.46, 0, 0]} scale={[0.9, 1.05, 0.78]}><icosahedronGeometry args={[1, 4]} /><meshStandardMaterial color="#c5a489" metalness={0.72} roughness={0.3} wireframe /></mesh>
  </group>
}
