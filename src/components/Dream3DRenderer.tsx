import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { DreamScene, DreamElement } from '../types'

/**
 * 3D Dream World Renderer Component
 * Renders dream scenes in 3D space with surreal aesthetics
 */

interface Dream3DRendererProps {
  scene: DreamScene
  onExplore?: () => void
}

export const Dream3DRenderer: React.FC<Dream3DRendererProps> = ({ scene, onExplore }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const elementsRef = useRef<THREE.Mesh[]>([])
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const threeScene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 15)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x0a0a0a, 0.9)
    renderer.shadowMap.enabled = true
    containerRef.current.appendChild(renderer.domElement)

    sceneRef.current = threeScene
    cameraRef.current = camera
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(scene.lighting.primaryColor, scene.lighting.ambientIntensity)
    threeScene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(scene.lighting.secondaryColor, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    threeScene.add(directionalLight)

    const pointLight = new THREE.PointLight(scene.lighting.primaryColor, 0.6, 50)
    pointLight.position.set(0, 10, 0)
    threeScene.add(pointLight)

    // Fog
    if (scene.fog.enabled) {
      threeScene.fog = new THREE.Fog(
        scene.fog.color,
        scene.fog.far,
        scene.fog.near
      )
    }

    // Create dream elements
    scene.elements.forEach((element, index) => {
      const geometry = createGeometryForElement(element, index)
      const material = new THREE.MeshPhongMaterial({
        color: element.color,
        emissive: new THREE.Color(element.color).multiplyScalar(0.3),
        wireframe: Math.random() > 0.7, // Some surreal wireframe elements
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(element.position.x, element.position.y, element.position.z)
      mesh.scale.set(element.scale, element.scale, element.scale)
      mesh.castShadow = true
      mesh.receiveShadow = true

      // Store original position for floating animation
      (mesh as any).originalPosition = { ...element.position }
      (mesh as any).floatSpeed = 0.5 + Math.random() * 0.5

      threeScene.add(mesh)
      elementsRef.current.push(mesh)
    })

    // Background stars/particles
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 200
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100
      positions[i + 1] = (Math.random() - 0.5) * 100
      positions[i + 2] = (Math.random() - 0.5) * 100
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.2,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    threeScene.add(stars)

    // Mouse controls for camera
    let targetRotation = { x: 0, y: 0 }
    const onMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1

      targetRotation.x = y * 0.3
      targetRotation.y = x * 0.3
    }

    window.addEventListener('mousemove', onMouseMove)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      // Smooth camera rotation
      camera.rotation.x += (targetRotation.x - camera.rotation.x) * 0.05
      camera.rotation.y += (targetRotation.y - camera.rotation.y) * 0.05

      // Animate elements with floating effect
      elementsRef.current.forEach((mesh) => {
        const originalPos = (mesh as any).originalPosition
        const speed = (mesh as any).floatSpeed
        const time = Date.now() * 0.001

        mesh.position.y = originalPos.y + Math.sin(time * speed) * 2
        mesh.rotation.x += 0.002
        mesh.rotation.y += 0.003
        mesh.rotation.z += 0.001
      })

      // Animate stars
      stars.rotation.z += 0.0001

      renderer.render(threeScene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }

      if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      renderer.dispose()
      geometry?.dispose()
      starGeometry.dispose()
    }
  }, [scene])

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gradient-to-b from-dream-dark to-black relative overflow-hidden"
      style={{ minHeight: '400px' }}
    >
      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-8">
        {onExplore && (
          <button
            onClick={onExplore}
            className="pointer-events-auto px-6 py-3 rounded-lg bg-gradient-to-r from-dream-blue to-dream-purple text-white font-medium hover:shadow-glow-lg transition-all duration-300"
          >
            Explore Dream
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Create different geometries based on element type
 */
function createGeometryForElement(element: DreamElement, index: number): THREE.BufferGeometry {
  const type = element.type.toLowerCase()
  const seed = index % 5

  if (type.includes('location')) {
    if (seed === 0) return new THREE.TorusGeometry(2, 0.5, 16, 8)
    if (seed === 1) return new THREE.OctahedronGeometry(1.5)
    if (seed === 2) return new THREE.IcosahedronGeometry(1)
    if (seed === 3) return new THREE.TetrahedronGeometry(2)
    return new THREE.SphereGeometry(1.5, 32, 32)
  }

  if (type.includes('creature')) {
    if (seed === 0) return new THREE.ConeGeometry(1, 3, 8)
    if (seed === 1) return new THREE.TetrahexahedronGeometry(1)
    return new THREE.IcosahedronGeometry(1.2)
  }

  if (type.includes('object')) {
    if (seed === 0) return new THREE.BoxGeometry(1, 1.5, 1)
    if (seed === 1) return new THREE.CylinderGeometry(1, 1, 2, 8)
    if (seed === 2) return new THREE.ConeGeometry(1, 2, 16)
    return new THREE.DodecahedronGeometry(1)
  }

  // Abstract elements
  return new THREE.IcosahedronGeometry(1 + Math.random() * 0.5)
}

// Type guard - geometry might not be defined initially
let geometry: THREE.BufferGeometry | undefined
