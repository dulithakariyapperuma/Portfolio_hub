import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

type Hemisphere = 'build' | 'create' | null

interface MeshEntry {
  mesh: THREE.Mesh
  material: THREE.MeshPhysicalMaterial
  side: Hemisphere
  baseEmissive: THREE.Color
  activeEmissive: THREE.Color
}

// Emissive highlights tailored to soft pink translucent material
const BUILD_EMISSIVE = new THREE.Color('#ff7b60') // Warm peach glow on left
const CREATE_EMISSIVE = new THREE.Color('#38bdf8') // Cyan blue glow on right
const IDLE_EMISSIVE = new THREE.Color('#2a1218') // Deep soft dark pink idle

export function BrainModel({ active, pointer }: { active: Hemisphere; pointer: React.RefObject<THREE.Vector2> }) {
  const { scene } = useGLTF(import.meta.env.VITE_BRAIN_MODEL_URL || '/models/brain.glb') as GLTF
  const root = useRef<THREE.Group>(null)
  const activeRef = useRef<Hemisphere>(null)
  const meshEntries = useRef<MeshEntry[]>([])
  const tempColor = useRef(new THREE.Color())

  useEffect(() => {
    activeRef.current = active
  }, [active])

  // Clone scene and set up smooth MeshPhysicalMaterial ONCE
  const model = useMemo(() => {
    const clone = scene.clone(true)
    const entries: MeshEntry[] = []

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return

      // Smooth vertex normals for clean glossy curves
      object.geometry = object.geometry.clone()
      object.geometry.computeVertexNormals()
      object.castShadow = true
      object.receiveShadow = true

      const name = object.name.toLowerCase()
      const side: Hemisphere = name.includes('left') ? 'build' : name.includes('right') ? 'create' : null

      if (name.includes('cerebellum')) object.scale.multiplyScalar(0.85)
      if (name.includes('brainstem')) object.scale.multiplyScalar(0.9)

      // Glossy clay/wax pink material matching reference image
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f49aa9'), // Soft translucent pink
        roughness: 0.18,
        metalness: 0.02,
        clearcoat: 0.85,
        clearcoatRoughness: 0.12,
        sheen: 0.45,
        sheenColor: new THREE.Color('#ffc0cb'),
        emissive: IDLE_EMISSIVE,
        emissiveIntensity: 0.04,
      })

      object.material = material
      entries.push({
        mesh: object,
        material,
        side,
        baseEmissive: IDLE_EMISSIVE.clone(),
        activeEmissive:
          side === 'build'
            ? BUILD_EMISSIVE.clone()
            : side === 'create'
            ? CREATE_EMISSIVE.clone()
            : IDLE_EMISSIVE.clone(),
      })
    })

    meshEntries.current = entries

    const bounds = new THREE.Box3().setFromObject(clone)
    const center = bounds.getCenter(new THREE.Vector3())
    const size = bounds.getSize(new THREE.Vector3())
    clone.position.sub(center)
    clone.scale.setScalar(3.8 / Math.max(size.x, size.y, size.z))
    return clone
  }, [scene])

  // Per-frame interactive parallax and smooth emissive transition
  useFrame((state, delta) => {
    if (!root.current) return
    const currentActive = activeRef.current
    const pointerPosition = pointer.current ?? zeroVector

    // Rotation parallax + hemisphere bias
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      pointerPosition.x * 0.25 + (currentActive === 'build' ? -0.15 : currentActive === 'create' ? 0.15 : 0),
      2.4,
      delta,
    )
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -pointerPosition.y * 0.15, 2.4, delta)

    // Gentle breathing floating motion
    root.current.position.y = Math.sin(state.clock.elapsedTime * 0.75) * 0.06
    root.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.02

    // Smoothly interpolate emissive color intensity per mesh
    for (const entry of meshEntries.current) {
      const isActive = currentActive !== null && currentActive === entry.side
      const targetEmissive = isActive ? entry.activeEmissive : entry.baseEmissive
      const targetIntensity = isActive ? 0.35 : 0.04

      tempColor.current.copy(entry.material.emissive)
      tempColor.current.lerp(targetEmissive, 1 - Math.exp(-4.5 * delta))
      entry.material.emissive.copy(tempColor.current)
      entry.material.emissiveIntensity = THREE.MathUtils.damp(
        entry.material.emissiveIntensity,
        targetIntensity,
        4.5,
        delta,
      )
    }
  })

  const orientation = new THREE.Matrix4().set(0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1)

  return (
    <group ref={root}>
      <group quaternion={new THREE.Quaternion().setFromRotationMatrix(orientation)} scale={[1, 1.25, 0.96]}>
        <primitive object={model} />
      </group>
    </group>
  )
}

const zeroVector = new THREE.Vector2()

useGLTF.preload('/models/brain.glb')
