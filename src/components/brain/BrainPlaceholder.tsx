import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function BrainPlaceholder() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.z = clock.elapsedTime * 0.8
    }
  })
  return (
    <group>
      <mesh ref={mesh}>
        <ringGeometry args={[1.4, 1.45, 64]} />
        <meshBasicMaterial color="#f49aa9" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
