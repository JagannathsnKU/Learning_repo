import React, { useEffect, useRef } from 'react'
import type { DreamScene, DreamElement } from '../types'

/**
 * 2D Dream World Canvas Renderer Component
 * Renders dream scenes as stylized 2D top-down or side-scrolling views
 */

interface Dream2DRendererProps {
  scene: DreamScene
  viewType?: 'topdown' | 'sidescroll'
}

export const Dream2DRenderer: React.FC<Dream2DRendererProps> = ({
  scene,
  viewType = 'topdown',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    // Parse color
    const parseColor = (color: string): [number, number, number] => {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      return [r, g, b]
    }

    // Draw element with surreal effect
    const drawElement = (
      element: DreamElement,
      x: number,
      y: number,
      time: number
    ): void => {
      const [r, g, b] = parseColor(element.color)
      const scale = element.scale * 15

      ctx.save()
      ctx.globalAlpha = 0.85
      ctx.translate(x, y)

      // Floating animation
      const float = Math.sin(time * element.scale * 0.5) * 5
      ctx.translate(0, float)

      // Rotation
      ctx.rotate((time * 0.001 * element.scale) % Math.PI * 2)

      // Draw based on type
      switch (element.type) {
        case 'location':
          // Large geometric shape
          drawStar(ctx, 0, 0, scale, 6, `rgba(${r}, ${g}, ${b}, 0.8)`)
          drawCircle(ctx, 0, 0, scale * 0.6, `rgba(${r}, ${g}, ${b}, 0.3)`, true)
          break

        case 'creature':
          // Organic wavy shape
          drawOrganic(ctx, 0, 0, scale, `rgba(${r}, ${g}, ${b}, 0.8)`)
          break

        case 'object':
          // Rectangle with glow
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`
          ctx.fillRect(-scale / 2, -scale / 2, scale, scale)
          drawGlow(ctx, 0, 0, scale, `rgba(${r}, ${g}, ${b}, 0.3)`)
          break

        case 'abstract':
        default:
          // Spiral pattern
          drawSpiral(ctx, 0, 0, scale, `rgba(${r}, ${g}, ${b}, 0.7)`)
          break
      }

      ctx.restore()
    }

    // Draw circle
    const drawCircle = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      color: string,
      stroke: boolean = false
    ): void => {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      if (stroke) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.stroke()
      } else {
        ctx.fillStyle = color
        ctx.fill()
      }
    }

    // Draw star shape
    const drawStar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      points: number,
      color: string
    ): void => {
      ctx.fillStyle = color
      ctx.beginPath()

      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? size : size * 0.5
        const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }

      ctx.closePath()
      ctx.fill()
    }

    // Draw organic wavy shape
    const drawOrganic = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string
    ): void => {
      ctx.fillStyle = color
      ctx.beginPath()

      const points = 8
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2
        const radius = size * (0.8 + Math.sin(angle * 3) * 0.2)
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.quadraticCurveTo(
            x + Math.cos(angle - Math.PI / points) * size,
            y + Math.sin(angle - Math.PI / points) * size,
            px,
            py
          )
        }
      }

      ctx.closePath()
      ctx.fill()
    }

    // Draw spiral
    const drawSpiral = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string
    ): void => {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 4
        const radius = (i / 50) * size
        const px = x + Math.cos(angle) * radius
        const py = y + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }

      ctx.stroke()
    }

    // Draw glow effect
    const drawGlow = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string
    ): void => {
      for (let i = 3; i > 0; i--) {
        ctx.fillStyle = color.replace('0.3', String(0.3 / (4 - i)))
        ctx.beginPath()
        ctx.arc(x, y, size + i * 5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Animation loop
    const animate = (time: number) => {
      animationIdRef.current = requestAnimationFrame(animate)

      // Clear canvas with dark background
      ctx.fillStyle = '#0A0A0A'
      ctx.fillRect(0, 0, width, height)

      // Draw fog effect
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300)
      gradient.addColorStop(0, 'rgba(79, 159, 255, 0.1)')
      gradient.addColorStop(1, 'rgba(10, 10, 10, 0.9)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw grid or background pattern
      ctx.strokeStyle = 'rgba(79, 159, 255, 0.05)'
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw elements
      scene.elements.forEach((element) => {
        const angle = Math.atan2(element.position.y, element.position.x)
        const distance = Math.sqrt(element.position.x ** 2 + element.position.y ** 2)
        const screenX = centerX + Math.cos(angle) * Math.min(distance * 10, width / 2)
        const screenY = centerY + Math.sin(angle) * Math.min(distance * 10, height / 2)

        drawElement(element, screenX, screenY, time)
      })

      // Draw center indicator
      drawCircle(ctx, centerX, centerY, 3, 'rgba(79, 159, 255, 0.5)')

      // Draw mouse interaction effect
      if (mousePos.current) {
        const dx = mousePos.current.x - centerX
        const dy = mousePos.current.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200) {
          ctx.strokeStyle = `rgba(79, 159, 255, ${0.3 * (1 - distance / 200)})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(centerX, centerY, distance, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }

    animate(Date.now())

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth * window.devicePixelRatio
        canvasRef.current.height = canvasRef.current.offsetHeight * window.devicePixelRatio
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [scene])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-gradient-to-b from-dream-dark to-black"
      style={{ minHeight: '400px', display: 'block' }}
    />
  )
}
