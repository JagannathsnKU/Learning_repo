import React from 'react'
import type { DreamScene } from '../types'
import { GlassButton } from './GlassUI'

/**
 * Dream Video Renderer Component
 * Displays an animated cinematic video of the dream sequence
 */

interface DreamVideoRendererProps {
  scene: DreamScene
  videoPrompt: string
  onExplore?: () => void
}

export const DreamVideoRenderer: React.FC<DreamVideoRendererProps> = ({
  scene,
  videoPrompt,
  onExplore,
}) => {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleGenerateVideo = async () => {
    setIsLoading(true)
    console.log('[DreamVideoRenderer] Generating video for prompt:', videoPrompt)
    // In production, this would call a video generation API like Runway or HeyGen
    // For now, display placeholder
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-dream-dark to-black relative overflow-hidden flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-dream-blue to-dream-purple bg-clip-text text-transparent">
          Dream Video
        </h2>
        <p className="text-white/60 max-w-md">
          {isLoading ? 'Generating your dream video...' : 'Ready to generate a cinematic video of your dream'}
        </p>

        {!isLoading ? (
          <div className="space-y-4">
            <GlassButton onClick={handleGenerateVideo} variant="primary">
              Generate Dream Video
            </GlassButton>
            {onExplore && (
              <GlassButton onClick={onExplore} variant="secondary">
                View as 3D Map Instead
              </GlassButton>
            )}
          </div>
        ) : (
          <div className="animate-pulse text-white/40">Rendering...</div>
        )}
      </div>
    </div>
  )
}
