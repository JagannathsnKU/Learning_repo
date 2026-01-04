import type { DreamMap, DreamScene, DreamElement, LightingSetup, FogSetup } from '../types'

/**
 * AI-powered dream interpretation using OpenAI GPT
 * Generates detailed, realistic scene descriptions and structured data
 */

// Use a type assertion for ImportMeta to avoid strict typing issues
declare global {
  interface ImportMeta {
    env: {
      VITE_OPENAI_API_KEY?: string
      [key: string]: string | undefined
    }
  }
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

interface EnhancedDreamScene {
  title: string
  narration: string
  mood: string
  colors: string[]
  elements: DreamElement[]
  detailedDescription: string
  videoPrompt: string
  lighting: LightingSetup
  fog: FogSetup
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * Use OpenAI to generate a detailed, realistic interpretation of the dream
 * Extracts mood, characters, locations, and creates prompts for image/video generation
 */
async function generateDetailedDreamInterpretation(narration: string): Promise<EnhancedDreamScene> {
  if (!OPENAI_API_KEY) {
    console.warn('[AI Interpreter] No OpenAI API key provided, using fallback interpretation')
    return generateFallbackInterpretation(narration)
  }

  try {
    console.log('[AI Interpreter] Requesting detailed dream interpretation from OpenAI...')
    
    const systemPrompt = `You are a skilled dream analyst and creative writer. Given a dream description, you will:
1. Extract the mood/feeling of the dream (ominous, peaceful, exciting, melancholic, surreal, etc.)
2. Identify key colors that dominate the dream
3. Identify dream elements (creatures, locations, objects, abstract concepts)
4. Generate a detailed, vivid description suitable for illustration
5. Create a prompt for video/image generation that captures the dream's essence
6. Return valid JSON with no markdown formatting

IMPORTANT: For creatures and characters mentioned, use your knowledge to generate realistic, recognizable versions. For example:
- If user mentions "spiderman", describe the actual character with accurate appearance
- If user mentions "alien", imagine a realistic extraterrestrial based on common depictions
- If user mentions "angel", envision realistic human features with wings
Be specific about clothing, colors, features, and actions.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Please analyze this dream narration and return a JSON response with the following structure:
{
  "mood": "string (ominous/peaceful/exciting/melancholic/surreal)",
  "colors": ["array of hex colors like #FF6B6B"],
  "elements": [
    {
      "name": "element name",
      "type": "location/creature/object/abstract",
      "description": "detailed description for illustration",
      "position": {"x": 0, "y": 0, "z": 0},
      "color": "#RRGGBB"
    }
  ],
  "detailedDescription": "2-3 sentences describing the dream scene in vivid detail for 2D illustration",
  "videoPrompt": "A detailed, cinematic prompt describing the dream as a short video sequence. Include camera movements, lighting, mood, and character actions.",
  "lightingMood": "description of lighting setup"
}

Dream narration: "${narration}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[AI Interpreter] OpenAI API error:', error)
      return generateFallbackInterpretation(narration)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse JSON from response (handle potential markdown formatting)
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1])
      } else {
        throw new Error('Could not parse JSON from response')
      }
    }

    console.log('[AI Interpreter] Successfully generated detailed interpretation')

    return {
      title: `Dream: ${new Date().toLocaleDateString()}`,
      narration,
      mood: parsed.mood || 'surreal',
      colors: parsed.colors || ['#4F9FFF', '#8B7BFF'],
      elements: (parsed.elements || []).map((el: any) => ({
        id: generateId(),
        name: el.name,
        type: el.type,
        description: el.description,
        position: el.position || { x: 0, y: 0, z: 0 },
        color: el.color || '#8B7BFF',
        scale: 1,
        mood: parsed.mood || 'surreal',
      })),
      detailedDescription: parsed.detailedDescription || narration,
      videoPrompt: parsed.videoPrompt || `A cinematic visualization of: ${narration}`,
      lighting: generateLightingSetup(parsed.mood || 'surreal', parsed.colors || []),
      fog: generateFogSetup(parsed.mood || 'surreal'),
    }
  } catch (error) {
    console.error('[AI Interpreter] Error during AI interpretation:', error)
    return generateFallbackInterpretation(narration)
  }
}

/**
 * Fallback interpretation when AI is unavailable
 */
function generateFallbackInterpretation(narration: string): EnhancedDreamScene {
  console.log('[AI Interpreter] Using fallback interpretation')
  
  const mood = extractMood(narration)
  const colors = extractColors(narration)
  const elements = generateFallbackElements(narration)

  return {
    title: `Dream: ${new Date().toLocaleDateString()}`,
    narration,
    mood,
    colors,
    elements,
    detailedDescription: `A surreal dream scene featuring: ${narration}. The landscape shifts between familiar and impossible geometries, with colors bleeding into each other in dreamlike transitions.`,
    videoPrompt: `A cinematic, surreal sequence showing: ${narration}. Camera floats through impossible architecture with ethereal lighting and dreamlike transitions between scenes.`,
    lighting: generateLightingSetup(mood, colors),
    fog: generateFogSetup(mood),
  }
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

  if (colors.length === 0) {
    colors.push('#4F9FFF', '#8B7BFF', '#111827')
  }

  return colors
}

function generateFallbackElements(narration: string): DreamElement[] {
  const elements: DreamElement[] = []
  const keywordMap: Record<string, { type: string; color: string }> = {
    spider: { type: 'creature', color: '#8B4513' },
    spiderman: { type: 'creature', color: '#DC2626' },
    dragon: { type: 'creature', color: '#DC2626' },
    angel: { type: 'creature', color: '#FCD34D' },
    alien: { type: 'creature', color: '#10B981' },
    ghost: { type: 'creature', color: '#F3F4F6' },
    castle: { type: 'location', color: '#9CA3AF' },
    forest: { type: 'location', color: '#10B981' },
    ocean: { type: 'location', color: '#4F9FFF' },
    mountain: { type: 'location', color: '#8B7BFF' },
    sky: { type: 'location', color: '#F3F4F6' },
    flying: { type: 'object', color: '#FFD700' },
    falling: { type: 'object', color: '#FF6B6B' },
    swimming: { type: 'object', color: '#4F9FFF' },
    light: { type: 'abstract', color: '#FBBF24' },
    darkness: { type: 'abstract', color: '#1F2937' },
  }

  const lowerNarration = narration.toLowerCase()

  for (const [keyword, props] of Object.entries(keywordMap)) {
    if (lowerNarration.includes(keyword)) {
      elements.push({
        id: generateId(),
        name: keyword,
        type: props.type as 'location' | 'object' | 'creature' | 'abstract',
        description: `A ${keyword} appears in the dream`,
        position: {
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20,
          z: (Math.random() - 0.5) * 20,
        },
        color: props.color,
        scale: 1,
        mood: extractMood(narration),
      })
    }
  }

  // If no elements found, create generic ones based on mood
  if (elements.length === 0) {
    elements.push({
      id: generateId(),
      name: 'mysterious figure',
      type: 'creature',
      description: 'An enigmatic presence in the dream',
      position: { x: 0, y: 0, z: 0 },
      color: '#8B7BFF',
      scale: 1,
      mood: extractMood(narration),
    })
  }

  return elements
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

export async function interpretDreamWithAI(narration: string): Promise<DreamMap> {
  const startTime = Date.now()
  console.log('[Dream Interpreter] Starting AI dream interpretation...')

  try {
    const enhancedScene = await generateDetailedDreamInterpretation(narration)

    const scene: DreamScene = {
      id: generateId(),
      title: enhancedScene.title,
      narration: enhancedScene.narration,
      timestamp: Date.now(),
      mood: enhancedScene.mood,
      colors: enhancedScene.colors,
      elements: enhancedScene.elements,
      transitions: [],
      lighting: enhancedScene.lighting,
      fog: enhancedScene.fog,
    }

    const dreamMap: DreamMap = {
      id: generateId(),
      title: enhancedScene.title,
      narration,
      scenes: [scene],
      generatedAt: Date.now(),
      isPublic: false,
      detailedDescription: enhancedScene.detailedDescription,
      videoPrompt: enhancedScene.videoPrompt,
    }

    const endTime = Date.now()
    console.log(`[Dream Interpreter] AI interpretation complete. Total time: ${endTime - startTime}ms`)

    return dreamMap
  } catch (error) {
    console.error('[Dream Interpreter] Error during interpretation:', error)
    throw error
  }
}

export async function generateImageFromPrompt(prompt: string): Promise<string> {
  // This would use Stability AI or DALL-E for image generation
  // For now, return placeholder
  console.log('[Image Generator] Would generate image for:', prompt)
  return 'https://via.placeholder.com/800x600?text=Dream+Illustration'
}

export async function generateVideoFromPrompt(prompt: string): Promise<string> {
  // This would use HeyGen, Runway, or similar for video generation
  // For now, return placeholder
  console.log('[Video Generator] Would generate video for:', prompt)
  return 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder
}
