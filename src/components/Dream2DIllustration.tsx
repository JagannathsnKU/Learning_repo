import React, { useEffect, useRef } from 'react'
import type { DreamScene } from '../types'

/**
 * Enhanced Dream 2D Illustration Renderer
 * Creates detailed, artistic illustrations of dreams with improved composition
 */

interface Dream2DIllustrationProps {
  scene: DreamScene
}

export const Dream2DIllustration: React.FC<Dream2DIllustrationProps> = ({ scene }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set high resolution
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    // Render the dream illustration
    renderDreamIllustration(ctx, width, height, scene)

    return () => {
      // Cleanup
    }
  }, [scene])

  return (
    <div className="w-full h-full flex flex-col">
      <canvas
        ref={canvasRef}
        className="flex-1 bg-gradient-to-b from-gray-900 via-black to-gray-900"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="p-4 bg-black/50 backdrop-blur border-t border-white/10">
        <p className="text-white/60 text-xs">
          {scene.narration}
        </p>
      </div>
    </div>
  )
}

function renderDreamIllustration(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: any
) {
  // Create gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
  bgGradient.addColorStop(0, '#1a1a2e')
  bgGradient.addColorStop(0.5, '#0f0f1e')
  bgGradient.addColorStop(1, '#000000')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)

  // Add dream mood overlay
  const moodAlpha = getMoodOpacity(scene.mood)
  const moodColor = scene.colors[0] || '#8B7BFF'
  ctx.fillStyle = adjustAlpha(moodColor, moodAlpha)
  ctx.fillRect(0, 0, width, height)

  // Draw atmospheric elements
  drawAtmosphere(ctx, width, height, scene.colors)

  // Draw main scene elements with improved composition
  const centerX = width / 2
  const centerY = height / 2.5 // Offset for better composition

  // Sort elements by depth (distance from viewer)
  const sortedElements = [...scene.elements].sort((a, b) => {
    const aDepth = Math.sqrt(a.position.x ** 2 + a.position.y ** 2 + a.position.z ** 2)
    const bDepth = Math.sqrt(b.position.x ** 2 + b.position.y ** 2 + b.position.z ** 2)
    return aDepth - bDepth
  })

  // Draw elements with proper perspective
  sortedElements.forEach((element, index) => {
    const screenX = centerX + (element.position.x * width) / 30
    const screenY = centerY + (element.position.y * height) / 30
    const depthScale = Math.max(0.5, element.scale)

    drawDreamElement(
      ctx,
      element,
      screenX,
      screenY,
      depthScale,
      index,
      sortedElements.length
    )
  })

  // Add foreground details
  drawForegroundDetails(ctx, width, height, scene.mood, scene.colors)

  // Add vignette effect
  drawVignette(ctx, width, height)
}

function getMoodOpacity(mood: string): number {
  const opacities: Record<string, number> = {
    ominous: 0.3,
    peaceful: 0.1,
    exciting: 0.15,
    melancholic: 0.25,
    surreal: 0.2,
  }
  return opacities[mood] || 0.15
}

function adjustAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function drawAtmosphere(ctx: CanvasRenderingContext2D, width: number, height: number, colors: string[]) {
  // Draw floating particles/stars
  const particleCount = 50
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 2
    const opacity = Math.random() * 0.3 + 0.1

    ctx.fillStyle = adjustAlpha(colors[i % colors.length], opacity)
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  // Draw atmospheric perspective layers
  for (let layer = 0; layer < 3; layer++) {
    const layerOpacity = (0.1 - layer * 0.03) * 0.5
    ctx.strokeStyle = adjustAlpha(colors[(layer + 1) % colors.length], layerOpacity)
    ctx.lineWidth = 1
    
    const waveHeight = 50 + layer * 20
    ctx.beginPath()
    ctx.moveTo(0, height / 2 + layer * 40)
    
    for (let x = 0; x <= width; x += 20) {
      const y = height / 2 + layer * 40 + Math.sin(x / 100 + layer) * waveHeight
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

function drawDreamElement(
  ctx: CanvasRenderingContext2D,
  element: any,
  x: number,
  y: number,
  scale: number,
  index: number,
  total: number
) {
  const depthFade = 1 - (index / total) * 0.3

  ctx.save()
  ctx.globalAlpha = depthFade

  // Create color with depth
  const color = element.color

  // Draw shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
  ctx.beginPath()
  ctx.ellipse(x + 5, y + scale * 15, scale * 20, scale * 8, 0, 0, Math.PI * 2)
  ctx.fill()

  // Draw element based on type
  switch (element.type.toLowerCase()) {
    case 'creature':
      drawCreature(ctx, x, y, scale, color)
      break
    case 'location':
      drawLocation(ctx, x, y, scale, color)
      break
    case 'object':
      drawObject(ctx, x, y, scale, color)
      break
    case 'abstract':
      drawAbstract(ctx, x, y, scale, color)
      break
    default:
      drawGenericElement(ctx, x, y, scale, color)
  }

  // Add glow effect
  ctx.shadowColor = adjustAlpha(color, 0.6)
  ctx.shadowBlur = scale * 3
  ctx.globalAlpha = depthFade * 0.3

  ctx.restore()
}

function drawCreature(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
  // Draw a more organic, creature-like shape
  ctx.fillStyle = color
  
  // Body
  ctx.beginPath()
  ctx.ellipse(x, y, scale * 12, scale * 15, 0.2, 0, Math.PI * 2)
  ctx.fill()
  
  // Head
  ctx.beginPath()
  ctx.arc(x, y - scale * 18, scale * 8, 0, Math.PI * 2)
  ctx.fill()
  
  // Details/limbs with curves
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4
    const limbX = x + Math.cos(angle) * scale * 10
    const limbY = y + Math.sin(angle) * scale * 12
    
    ctx.beginPath()
    ctx.ellipse(limbX, limbY, scale * 4, scale * 8, angle, 0, Math.PI * 2)
    ctx.fill()
  }

  // Eyes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.beginPath()
  ctx.arc(x - scale * 3, y - scale * 18, scale * 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x + scale * 3, y - scale * 18, scale * 2, 0, Math.PI * 2)
  ctx.fill()
}

function drawLocation(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
  // Draw architectural/landscape elements
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.fillStyle = adjustAlpha(color, 0.3)

  // Main shape
  ctx.beginPath()
  ctx.moveTo(x - scale * 15, y)
  ctx.lineTo(x, y - scale * 20)
  ctx.lineTo(x + scale * 15, y)
  ctx.lineTo(x + scale * 10, y + scale * 15)
  ctx.lineTo(x - scale * 10, y + scale * 15)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Details
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = adjustAlpha(color, 0.5)
    ctx.fillRect(x - scale * 8 + i * scale * 6, y - scale * 10, scale * 4, scale * 8)
  }
}

function drawObject(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
  ctx.fillStyle = color
  ctx.strokeStyle = adjustAlpha(color, 0.6)
  ctx.lineWidth = 2

  // Draw a dimensional object
  ctx.beginPath()
  ctx.moveTo(x - scale * 10, y - scale * 10)
  ctx.lineTo(x + scale * 10, y - scale * 10)
  ctx.lineTo(x + scale * 12, y - scale * 8)
  ctx.lineTo(x + scale * 12, y + scale * 12)
  ctx.lineTo(x + scale * 10, y + scale * 10)
  ctx.lineTo(x - scale * 10, y + scale * 10)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

function drawAbstract(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
  ctx.fillStyle = color

  // Draw swirling abstract patterns
  ctx.beginPath()
  for (let i = 0; i < 360; i += 10) {
    const angle = (i * Math.PI) / 180
    const radius = scale * (5 + Math.sin(i / 20) * 5)
    const px = x + Math.cos(angle) * radius
    const py = y + Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
}

function drawGenericElement(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, scale * 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = adjustAlpha(color, 0.6)
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawForegroundDetails(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mood: string,
  colors: string[]
) {
  // Add mood-based foreground effects
  switch (mood) {
    case 'ominous':
      // Dark fog/mist
      const darkGradient = ctx.createLinearGradient(0, height * 0.7, 0, height)
      darkGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)')
      darkGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
      ctx.fillStyle = darkGradient
      ctx.fillRect(0, height * 0.7, width, height * 0.3)
      break

    case 'peaceful':
      // Soft light glow
      ctx.fillStyle = adjustAlpha(colors[0], 0.1)
      ctx.fillRect(0, height * 0.8, width, height * 0.2)
      break

    case 'exciting':
      // Dynamic lines
      ctx.strokeStyle = adjustAlpha(colors[0], 0.2)
      ctx.lineWidth = 3
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(0, height * 0.7 + i * 15)
        ctx.lineTo(width, height * 0.7 + i * 15 - 30)
        ctx.stroke()
      }
      break
  }
}

function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height))
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}
