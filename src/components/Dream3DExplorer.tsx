import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { DreamScene } from '../types'
import { GlassButton } from './GlassUI'

/**
 * Dream 3D Explorer Component
 * Allows first-person exploration of a 3D dream world
 */

interface Dream3DExplorerProps {
  scene: DreamScene
  onExplore?: () => void
}

export const Dream3DExplorer: React.FC<Dream3DExplorerProps> = ({ scene, onExplore }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const playerRef = useRef({ x: 0, y: 1.6, z: 0, yaw: 0, pitch: 0 })
  const keysRef = useRef<Record<string, boolean>>({})

  useEffect(() => {
    if (!containerRef.current) return

    try {
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      if (width === 0 || height === 0) {
        console.error('[Dream3DExplorer] Container has zero dimensions')
        return
      }

      console.log('[Dream3DExplorer] Initializing first-person explorer')

      // Scene setup
      const threeScene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      camera.position.copy(new THREE.Vector3(playerRef.current.x, playerRef.current.y, playerRef.current.z))

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
      renderer.setSize(width, height)
      renderer.setClearColor(0x0a0a0a, 1)
      renderer.shadowMap.enabled = true
      containerRef.current.appendChild(renderer.domElement)

      cameraRef.current = camera
      rendererRef.current = renderer

      // Lighting setup based on dream mood
      const ambientLight = new THREE.AmbientLight(scene.lighting.primaryColor, scene.lighting.ambientIntensity)
      threeScene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(scene.lighting.secondaryColor, 0.8)
      directionalLight.position.set(10, 10, 5)
      directionalLight.castShadow = true
      threeScene.add(directionalLight)

      // Create a ground plane
      const groundGeometry = new THREE.PlaneGeometry(100, 100)
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: scene.colors[0] || '#4F9FFF',
        roughness: 0.8,
      })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      ground.receiveShadow = true
      threeScene.add(ground)

      // Create dream elements as explorable objects
      scene.elements.forEach((element, index) => {
        const geometry = createElementGeometry(element, index)
        const material = new THREE.MeshStandardMaterial({
          color: element.color,
          metalness: 0.3,
          roughness: 0.7,
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(element.position.x, element.position.y, element.position.z)
        mesh.scale.multiplyScalar(element.scale)
        mesh.castShadow = true
        mesh.receiveShadow = true

        threeScene.add(mesh)
      })

      // Add fog for atmosphere
      if (scene.fog.enabled) {
        threeScene.fog = new THREE.Fog(scene.fog.color, 50, 100)
      }

      // Input handling
      const handleKeyDown = (e: KeyboardEvent) => {
        keysRef.current[e.key.toLowerCase()] = true
      }

      const handleKeyUp = (e: KeyboardEvent) => {
        keysRef.current[e.key.toLowerCase()] = false
      }

      const handleMouseMove = (e: MouseEvent) => {
        const movementX = e.movementX || 0
        const movementY = e.movementY || 0

        playerRef.current.yaw -= movementX * 0.005
        playerRef.current.pitch -= movementY * 0.005

        // Clamp pitch
        playerRef.current.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, playerRef.current.pitch))
      }

      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
      containerRef.current.addEventListener('mousemove', handleMouseMove)

      // Pointer lock for immersive experience
      containerRef.current.addEventListener('click', () => {
        containerRef.current?.requestPointerLock?.()
      })

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate)

        // Movement
        const moveSpeed = 0.1
        const moveDir = new THREE.Vector3()

        if (keysRef.current['w']) moveDir.z -= moveSpeed
        if (keysRef.current['s']) moveDir.z += moveSpeed
        if (keysRef.current['a']) moveDir.x -= moveSpeed
        if (keysRef.current['d']) moveDir.x += moveSpeed
        if (keysRef.current[' ']) playerRef.current.y += moveSpeed

        // Apply forward/back relative to camera direction
        const forward = new THREE.Vector3(
          Math.sin(playerRef.current.yaw),
          0,
          Math.cos(playerRef.current.yaw)
        )
        const right = new THREE.Vector3(
          Math.cos(playerRef.current.yaw),
          0,
          -Math.sin(playerRef.current.yaw)
        )

        playerRef.current.x += (forward.x * moveDir.z + right.x * moveDir.x) * 10
        playerRef.current.z += (forward.z * moveDir.z + right.z * moveDir.x) * 10

        // Clamp height
        playerRef.current.y = Math.max(1.6, playerRef.current.y)

        // Update camera
        camera.position.set(playerRef.current.x, playerRef.current.y, playerRef.current.z)

        const cameraDir = new THREE.Vector3(
          Math.sin(playerRef.current.yaw),
          Math.tan(playerRef.current.pitch),
          Math.cos(playerRef.current.yaw)
        ).normalize()

        camera.lookAt(
          camera.position.x + cameraDir.x,
          camera.position.y + cameraDir.y,
          camera.position.z + cameraDir.z
        )

        renderer.render(threeScene, camera)
      }

      animate()

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return
        const newWidth = containerRef.current.clientWidth
        const newHeight = containerRef.current.clientHeight

        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
        window.removeEventListener('resize', handleResize)
        containerRef.current?.removeEventListener('mousemove', handleMouseMove)

        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
        }

        if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement)
        }

        renderer.dispose()
      }
    } catch (err) {
      console.error('[Dream3DExplorer] Error during setup:', err)
      return () => {}
    }
  }, [scene])

  return (
    <div ref={containerRef} className="w-full h-full bg-black relative overflow-hidden" style={{ minHeight: '600px' }}>
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 text-white/60 text-xs font-mono pointer-events-none">
        <div>WASD: Move | SPACE: Up | Mouse: Look</div>
        <div>Click to lock mouse</div>
      </div>

      {onExplore && (
        <div className="absolute bottom-4 right-4">
          <GlassButton onClick={onExplore} variant="secondary">
            Back to Video View
          </GlassButton>
        </div>
      )}
    </div>
  )
}

function createElementGeometry(element: any, index: number): THREE.BufferGeometry {
  const type = element.type.toLowerCase()
  const seed = index % 5

  if (type.includes('location')) {
    if (seed === 0) return new THREE.SphereGeometry(1.5, 32, 32)
    if (seed === 1) return new THREE.BoxGeometry(2, 2, 2)
    if (seed === 2) return new THREE.ConeGeometry(1, 3, 16)
    if (seed === 3) return new THREE.CylinderGeometry(1, 1, 3, 16)
    return new THREE.TorusGeometry(1, 0.5, 16, 8)
  }

  if (type.includes('creature')) {
    if (seed === 0) return new THREE.ConeGeometry(0.5, 2, 8)
    if (seed === 1) return new THREE.BoxGeometry(0.8, 1.5, 0.5)
    return new THREE.SphereGeometry(0.7, 16, 16)
  }

  if (type.includes('object')) {
    if (seed === 0) return new THREE.BoxGeometry(1, 1.5, 0.5)
    if (seed === 1) return new THREE.CylinderGeometry(0.5, 0.5, 1.5, 8)
    if (seed === 2) return new THREE.ConeGeometry(0.7, 2, 12)
    return new THREE.DodecahedronGeometry(0.8)
  }

  return new THREE.IcosahedronGeometry(0.8)
}
