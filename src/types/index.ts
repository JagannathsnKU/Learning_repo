/**
 * Core type definitions for DreamScape
 */

export interface DreamElement {
  id: string
  type: 'location' | 'object' | 'creature' | 'abstract'
  name: string
  description: string
  position: Vector3D
  scale: number
  color: string
  mood: string
  surreal?: boolean
}

export interface Vector3D {
  x: number
  y: number
  z: number
}

export interface Vector2D {
  x: number
  y: number
}

export interface DreamScene {
  id: string
  title: string
  narration: string
  timestamp: number
  mood: string
  colors: string[]
  elements: DreamElement[]
  transitions: SceneTransition[]
  lighting: LightingSetup
  fog: FogSetup
}

export interface SceneTransition {
  from: string
  to: string
  type: 'fade' | 'morph' | 'fly' | 'dissolve'
  duration: number
}

export interface LightingSetup {
  ambientIntensity: number
  primaryColor: string
  secondaryColor: string
  fogColor: string
}

export interface FogSetup {
  enabled: boolean
  density: number
  color: string
  near: number
  far: number
}

export interface DreamMap {
  id: string
  title: string
  narration: string
  scenes: DreamScene[]
  generatedAt: number
  isPublic: boolean
  shareToken?: string
}

export interface RecorderState {
  isRecording: boolean
  transcript: string
  duration: number
  isProcessing: boolean
}

export interface InterpreterState {
  isInterpreting: boolean
  dreamMap: DreamMap | null
  error: string | null
}

export interface AppState {
  currentDreamMap: DreamMap | null
  currentSceneIndex: number
  renderMode: '2d' | '3d'
  recorderState: RecorderState
  interpreterState: InterpreterState
  shareToken: string | null
  isExploring: boolean
}
