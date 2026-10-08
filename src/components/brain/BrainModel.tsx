import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

type Hemisphere = 'build' | 'create' | null

interface MeshEntry {
  mesh: THREE.Mesh
  material: THREE.MeshStandardMaterial
  side: Hemisphere
  baseEmissive: THREE.Color
  activeEmissive: THREE.Color
}

const BUILD_EMISSIVE = new THREE.Color('#557c73')
const CREATE_EMISSIVE = new THREE.Color('#906b50')
const IDLE_EMISSIVE = new THREE.Color('#111413')

export function BrainModel({ active, pointer }: { active: Hemisphere; pointer: React.RefObject<THREE.Vector2> }) {
  const { scene } = useGLTF(import.meta.env.VITE_BRAIN_MODEL_URL || '/models/brain.glb') as GLTF
  const root = useRef<THREE.Group>(null)
  const activeRef = useRef<Hemisphere>(null)
  const meshEntries = useRef<MeshEntry[]>([])
  const tempColor = useRef(new THREE.Color())

  // Keep activeRef in sync without triggering useMemo re-evaluation
  useEffect(() => { activeRef.current = active }, [active])

  // Clone the scene and set up materials ONCE when the GLB loads
  const model = useMemo(() => {
    const clone = scene.clone(true)
    const entries: MeshEntry[] = []

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return
      object.geometry = addCorticalFolds(object.geometry)
      object.castShadow = false
      object.receiveShadow = false
      const name = object.name.toLowerCase()
      const side: Hemisphere = name.includes('left') ? 'build' : name.includes('right') ? 'create' : null
      if (name.includes('cerebellum')) object.scale.multiplyScalar(0.4)
      if (name.includes('brainstem')) object.scale.multiplyScalar(0.52)
      const base = side === 'build' ? '#a9b4ac' : side === 'create' ? '#b9aaa0' : '#777c79'
      const material = new THREE.MeshStandardMaterial({
        color: base,
        metalness: 0.12,
        roughness: 0.76,
        emissive: IDLE_EMISSIVE,
        emissiveIntensity: 0.035,
      })
      object.material = material
      entries.push({
        mesh: object,
        material,
        side,
        baseEmissive: IDLE_EMISSIVE.clone(),
        activeEmissive: side === 'build' ? BUILD_EMISSIVE.clone() : side === 'create' ? CREATE_EMISSIVE.clone() : IDLE_EMISSIVE.clone(),
      })
    })

    meshEntries.current = entries

    const bounds = new THREE.Box3().setFromObject(clone)
    const center = bounds.getCenter(new THREE.Vector3())
    const size = bounds.getSize(new THREE.Vector3())
    clone.position.sub(center)
    clone.scale.setScalar(3.65 / Math.max(size.x, size.y, size.z))
    return clone
  }, [scene]) // Only depends on scene — NOT on active

  // Per-frame: smoothly interpolate emissive + handle rotation/breathing
  useFrame((state, delta) => {
    if (!root.current) return
    const currentActive = activeRef.current
    const pointerPosition = pointer.current ?? zeroVector

    // Rotation parallax + hemisphere bias
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      pointerPosition.x * 0.22 + (currentActive === 'build' ? -0.12 : currentActive === 'create' ? 0.12 : 0),
      2.4, delta,
    )
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -pointerPosition.y * 0.13, 2.4, delta)

    // Breathing
    root.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.055
    root.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.22) * 0.025

    // Smoothly update emissive colors per mesh
    for (const entry of meshEntries.current) {
      const isActive = currentActive !== null && currentActive === entry.side
      const targetEmissive = isActive ? entry.activeEmissive : entry.baseEmissive
      const targetIntensity = isActive ? 0.28 : 0.035

      tempColor.current.copy(entry.material.emissive)
      tempColor.current.lerp(targetEmissive, 1 - Math.exp(-4.5 * delta))
      entry.material.emissive.copy(tempColor.current)
      entry.material.emissiveIntensity = THREE.MathUtils.damp(entry.material.emissiveIntensity, targetIntensity, 4.5, delta)
    }
  })

  const orientation = new THREE.Matrix4().set(0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1)
  return <group ref={root}><group quaternion={new THREE.Quaternion().setFromRotationMatrix(orientation)} scale={[1, 1.32, 0.96]}><primitive object={model} /></group></group>
}

// --- Geometry utilities (run once per mesh) ---

function addCorticalFolds(source: THREE.BufferGeometry) {
  const geometry = source.clone()
  const positions = geometry.getAttribute('position')
  geometry.computeVertexNormals()
  const normals = geometry.getAttribute('normal')
  const original = new THREE.Vector3()
  const normal = new THREE.Vector3()
  for (let index = 0; index < positions.count; index++) {
    original.fromBufferAttribute(positions, index)
    normal.fromBufferAttribute(normals, index)
    const folds = Math.sin(original.x * 12 + Math.sin(original.y * 6 + original.z * 3) * 2.2 + Math.sin(original.z * 9 + original.y * 3) * 1.4)
    const secondaryFolds = Math.sin(original.y * 16 + Math.sin(original.x * 5 + original.z * 7) * 1.8)
    const low = ridgedNoise(original.x * 4.2, original.y * 4.2, original.z * 4.2)
    const displacement = folds * 0.032 + secondaryFolds * 0.012 + (low - 0.48) * 0.02
    positions.setXYZ(index, original.x + normal.x * displacement, original.y + normal.y * displacement, original.z + normal.z * displacement)
  }
  positions.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

function ridgedNoise(x: number, y: number, z: number) {
  const value = valueNoise(x, y, z) * 2 - 1
  return 1 - Math.abs(value)
}

function valueNoise(x: number, y: number, z: number) {
  const x0 = Math.floor(x), y0 = Math.floor(y), z0 = Math.floor(z)
  const tx = smooth(x - x0), ty = smooth(y - y0), tz = smooth(z - z0)
  const a = lerp(hash(x0, y0, z0), hash(x0 + 1, y0, z0), tx)
  const b = lerp(hash(x0, y0 + 1, z0), hash(x0 + 1, y0 + 1, z0), tx)
  const c = lerp(hash(x0, y0, z0 + 1), hash(x0 + 1, y0, z0 + 1), tx)
  const d = lerp(hash(x0, y0 + 1, z0 + 1), hash(x0 + 1, y0 + 1, z0 + 1), tx)
  return lerp(lerp(a, b, ty), lerp(c, d, ty), tz)
}

function hash(x: number, y: number, z: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return value - Math.floor(value)
}

function smooth(value: number) { return value * value * (3 - 2 * value) }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

const zeroVector = new THREE.Vector2()

useGLTF.preload('/models/brain.glb')
