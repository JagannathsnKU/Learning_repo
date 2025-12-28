import type { DreamMap, DreamScene, DreamElement, Vector3D, LightingSetup, FogSetup } from '../types'

/**
 * Mock AI service for interpreting dream narration into structured scenes
 * In production, this would call an LLM API (OpenAI, Anthropic, etc.)
 */

const MOCK_DREAM_DATABASE: Record<string, DreamMap> = {}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

function generateMockDreamInterpretation(narration: string): DreamScene[] {
  // Mock parsing of narration to extract dream elements
  const scenes: DreamScene[] = []
  
  const mood = extractMood(narration)
  const colors = extractColors(narration)
  const elements = generateDreamElements(narration)
  
  const scene: DreamScene = {
    id: generateId(),
    title: `Dream Scene`,
    narration: narration,
    timestamp: Date.now(),
    mood,
    colors,
    elements,
    transitions: [],
    lighting: generateLightingSetup(mood, colors),
    fog: generateFogSetup(mood),
  }
  
  scenes.push(scene)
  return scenes
}

function extractMood(narration: string): string {
  const lowerNarration = narration.toLowerCase()
  
  if (lowerNarration.includes('fear') || lowerNarration.includes('scared') || lowerNarration.includes('dark')) {
    return 'ominous'
  }
  if (lowerNarration.includes('peaceful') || lowerNarration.includes('calm') || lowerNarration.includes('serene')) {
    return 'peaceful'
  }
  if (lowerNarration.includes('excited') || lowerNarration.includes('adventure') || lowerNarration.includes('flying')) {
    return 'exciting'
  }
  if (lowerNarration.includes('sad') || lowerNarration.includes('lonely') || lowerNarration.includes('lost')) {
    return 'melancholic'
  }
  
  return 'surreal'
}

function extractColors(narration: string): string[] {
  const colorMap: Record<string, string[]> = {
    blue: ['#4F9FFF', '#2E5BFF', '#1E3A8A'],
    purple: ['#8B7BFF', '#7C3AED', '#5B21B6'],
    red: ['#FF6B6B', '#DC2626', '#7F1D1D'],
    green: ['#10B981', '#059669', '#065F46'],
    gold: ['#FBBF24', '#F59E0B', '#B45309'],
    dark: ['#0A0A0A', '#1F2937', '#111827'],
  }
  
  const lowerNarration = narration.toLowerCase()
  const colors: string[] = []
  
  for (const [colorName, colorValues] of Object.entries(colorMap)) {
    if (lowerNarration.includes(colorName)) {
      colors.push(colorValues[0])
    }
  }
  
  // Default colors
  if (colors.length === 0) {
    colors.push('#4F9FFF', '#8B7BFF', '#111827')
  }
  
  return colors
}

function generateDreamElements(narration: string): DreamElement[] {
  const elements: DreamElement[] = []
  const elementKeywords: Record<string, { type: string; color: string }> = {
    castle: { type: 'location', color: '#9CA3AF' },
    forest: { type: 'location', color: '#10B981' },
    ocean: { type: 'location', color: '#4F9FFF' },
    mountain: { type: 'location', color: '#8B7BFF' },
    sky: { type: 'location', color: '#F3F4F6' },
    flying: { type: 'object', color: '#FFD700' },
    falling: { type: 'object', color: '#FF6B6B' },
    swimming: { type: 'object', color: '#4F9FFF' },
    creature: { type: 'creature', color: '#A78BFA' },
    dragon: { type: 'creature', color: '#DC2626' },
    angel: { type: 'creature', color: '#FCD34D' },
    light: { type: 'abstract', color: '#FBBF24' },
    darkness: { type: 'abstract', color: '#1F2937' },
  }
  
  const lowerNarration = narration.toLowerCase()
  let elementId = 0
  
  for (const [keyword, config] of Object.entries(elementKeywords)) {
    if (lowerNarration.includes(keyword)) {
      elements.push({
        id: `element-${elementId++}`,
        type: config.type as any,
        name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
        description: `A ${keyword} from your dream`,
        position: generateRandomPosition(),
        scale: Math.random() * 0.5 + 0.5,
        color: config.color,
        mood: extractMood(narration),
        surreal: true,
      })
    }
  }
  
  // Always add at least 2-3 elements for variety
  if (elements.length === 0) {
    elements.push({
      id: 'element-0',
      type: 'location',
      name: 'Dreamscape',
      description: 'An abstract dreamscape',
      position: { x: 0, y: 0, z: 0 },
      scale: 1,
      color: '#4F9FFF',
      mood: extractMood(narration),
      surreal: true,
    })
  }
  
  return elements
}

function generateRandomPosition(): Vector3D {
  return {
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 20,
    z: (Math.random() - 0.5) * 20,
  }
}

function generateLightingSetup(mood: string, colors: string[]): LightingSetup {
  const setups: Record<string, LightingSetup> = {
    ominous: {
      ambientIntensity: 0.3,
      primaryColor: '#FF0000',
      secondaryColor: '#111111',
      fogColor: '#1F1F1F',
    },
    peaceful: {
      ambientIntensity: 0.8,
      primaryColor: '#87CEEB',
      secondaryColor: '#E0F2FE',
      fogColor: '#F0F9FF',
    },
    exciting: {
      ambientIntensity: 0.7,
      primaryColor: colors[0] || '#FFD700',
      secondaryColor: colors[1] || '#FF6B6B',
      fogColor: '#FEF3C7',
    },
    melancholic: {
      ambientIntensity: 0.4,
      primaryColor: '#6B7280',
      secondaryColor: '#4B5563',
      fogColor: '#2D3748',
    },
    surreal: {
      ambientIntensity: 0.6,
      primaryColor: colors[0] || '#8B7BFF',
      secondaryColor: colors[1] || '#4F9FFF',
      fogColor: '#1F2937',
    },
  }
  
  return setups[mood] || setups.surreal
}

function generateFogSetup(mood: string): FogSetup {
  const fogDensity: Record<string, number> = {
    ominous: 0.05,
    peaceful: 0.02,
    exciting: 0.015,
    melancholic: 0.04,
    surreal: 0.03,
  }
  
  return {
    enabled: true,
    density: fogDensity[mood] || 0.03,
    color: '#2D3748',
    near: 0.1,
    far: 100,
  }
}

export async function interpretDream(narration: string): Promise<DreamMap> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  const scenes = generateMockDreamInterpretation(narration)
  
  const dreamMap: DreamMap = {
    id: generateId(),
    title: `Dream: ${new Date().toLocaleDateString()}`,
    narration,
    scenes,
    generatedAt: Date.now(),
    isPublic: false,
  }
  
  // Store in mock database
  MOCK_DREAM_DATABASE[dreamMap.id] = dreamMap
  
  return dreamMap
}

export async function generateShareToken(dreamMapId: string): Promise<string> {
  const token = `share_${generateId()}`
  
  if (MOCK_DREAM_DATABASE[dreamMapId]) {
    MOCK_DREAM_DATABASE[dreamMapId].shareToken = token
    MOCK_DREAM_DATABASE[dreamMapId].isPublic = true
  }
  
  return token
}

export async function retrieveDreamByToken(token: string): Promise<DreamMap | null> {
  for (const dream of Object.values(MOCK_DREAM_DATABASE)) {
    if (dream.shareToken === token) {
      return dream
    }
  }
  return null
}

export function exportDreamAsJSON(dreamMap: DreamMap): string {
  return JSON.stringify(dreamMap, null, 2)
}

export function exportDreamAsFile(dreamMap: DreamMap): void {
  const json = exportDreamAsJSON(dreamMap)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dream_${dreamMap.id}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
