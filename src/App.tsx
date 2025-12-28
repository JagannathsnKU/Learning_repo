import React, { useState, useCallback, useEffect } from 'react'
import { useAppStore } from './store/appStore'
import { interpretDream, generateShareToken, exportDreamAsFile } from './services/dreamInterpreter'
import { VoiceRecorder } from './components/VoiceRecorder'
import { Dream3DRenderer } from './components/Dream3DRenderer'
import { Dream2DRenderer } from './components/Dream2DRenderer'
import { GlassPanel, GlassButton, GlassCard, GlassBadge, GlassDivider, LoadingSpinner } from './components/GlassUI'

/**
 * Main DreamScape Application
 * Orchestrates the dream recording, interpretation, and visualization flow
 */

type AppPhase = 'idle' | 'recording' | 'interpreting' | 'viewing'

export const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('idle')
  const [shareToken, setShareToken] = useState<string | null>(null)

  const {
    currentDreamMap,
    currentSceneIndex,
    renderMode,
    recorderState,
    interpreterState,
    setCurrentDreamMap,
    setRenderMode,
    setInterpreterState,
    setIsExploring,
    resetApp,
  } = useAppStore()

  // Handle transcription completion
  const handleTranscriptionComplete = useCallback(
    async (transcript: string) => {
      if (!transcript.trim()) return

      setPhase('interpreting')
      setInterpreterState({ isInterpreting: true, error: null })

      try {
        const dreamMap = await interpretDream(transcript)
        setCurrentDreamMap(dreamMap)
        setInterpreterState({
          isInterpreting: false,
          dreamMap,
          error: null,
        })
        setPhase('viewing')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to interpret dream'
        setInterpreterState({
          isInterpreting: false,
          error: errorMessage,
        })
        setPhase('recording')
      }
    },
    [setCurrentDreamMap, setInterpreterState]
  )

  // Handle sharing
  const handleShare = async () => {
    if (!currentDreamMap) return

    try {
      const token = await generateShareToken(currentDreamMap.id)
      setShareToken(token)
      const shareUrl = `${window.location.origin}?dream=${token}`
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!')
      })
    } catch (error) {
      console.error('Failed to generate share token:', error)
    }
  }

  // Handle export
  const handleExport = () => {
    if (!currentDreamMap) return
    exportDreamAsFile(currentDreamMap)
  }

  // Handle reset
  const handleReset = () => {
    resetApp()
    setPhase('idle')
    setShareToken(null)
  }

  const currentScene = currentDreamMap?.scenes[currentSceneIndex]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-dream-dark via-black to-dream-dark text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-dream-blue/5 to-dream-purple/5" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light tracking-tighter">
                <span className="bg-gradient-to-r from-dream-blue to-dream-purple bg-clip-text text-transparent">
                  DreamScape
                </span>
              </h1>
              <p className="text-white/40 text-sm mt-1">Visualize your dreams in immersive worlds</p>
            </div>

            {phase !== 'idle' && (
              <GlassButton variant="ghost" onClick={handleReset} size="sm">
                ← Back to Start
              </GlassButton>
            )}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          {phase === 'idle' && <PhaseIdle onStart={() => setPhase('recording')} />}

          {phase === 'recording' && (
            <PhaseRecording
              onTranscriptionComplete={handleTranscriptionComplete}
              isProcessing={interpreterState.isInterpreting}
            />
          )}

          {phase === 'interpreting' && <PhaseInterpreting />}

          {phase === 'viewing' && currentScene && (
            <PhaseViewing
              scene={currentScene}
              dreamMap={currentDreamMap!}
              renderMode={renderMode}
              onRenderModeChange={setRenderMode}
              onShare={handleShare}
              onExport={handleExport}
              onExplore={() => setIsExploring(true)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-white/40 text-sm">
            <p>DreamScape v0.1.0 • Bringing your dreams to life</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

/**
 * Phase 1: Idle state - Welcome screen
 */
interface PhaseIdleProps {
  onStart: () => void
}

const PhaseIdle: React.FC<PhaseIdleProps> = ({ onStart }) => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero section */}
      <div className="text-center space-y-6 py-12">
        <div className="text-6xl">✨</div>
        <h2 className="text-5xl font-light">Welcome to DreamScape</h2>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Turn your vivid dreams into explorable worlds. Describe your dream, and watch as AI transforms your narration into an immersive visual experience.
        </p>

        <GlassButton
          onClick={onStart}
          variant="primary"
          size="lg"
          className="mx-auto flex items-center gap-2 mt-8"
        >
          <span>🎤 Start Recording a Dream</span>
        </GlassButton>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <GlassCard hoverable>
          <div className="space-y-3">
            <div className="text-3xl">🎙️</div>
            <h3 className="text-lg font-medium">Voice Recording</h3>
            <p className="text-white/60 text-sm">
              Describe your dream using natural speech. Real-time transcription captures every detail.
            </p>
          </div>
        </GlassCard>

        <GlassCard hoverable>
          <div className="space-y-3">
            <div className="text-3xl">🤖</div>
            <h3 className="text-lg font-medium">AI Interpretation</h3>
            <p className="text-white/60 text-sm">
              Advanced AI analyzes your description and extracts the essence of your dream.
            </p>
          </div>
        </GlassCard>

        <GlassCard hoverable>
          <div className="space-y-3">
            <div className="text-3xl">🌍</div>
            <h3 className="text-lg font-medium">3D Worlds</h3>
            <p className="text-white/60 text-sm">
              Explore your dream rendered as a stunning 2D or 3D interactive environment.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

/**
 * Phase 2: Recording state
 */
interface PhaseRecordingProps {
  onTranscriptionComplete: (transcript: string) => void
  isProcessing: boolean
}

const PhaseRecording: React.FC<PhaseRecordingProps> = ({ onTranscriptionComplete, isProcessing }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-light">Describe Your Dream</h2>
        <p className="text-white/60">
          Share vivid details, colors, locations, emotions, and sensations from your dream. The more detail, the richer the world we create.
        </p>
      </div>

      <VoiceRecorder onTranscriptionComplete={onTranscriptionComplete} isProcessing={isProcessing} />

      {/* Tips section */}
      <GlassPanel className="p-6">
        <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-4">💡 Tips for Better Dreams</h3>
        <ul className="space-y-2 text-sm text-white/60">
          <li>• Mention specific locations, buildings, or landscapes</li>
          <li>• Describe the colors, lighting, and atmosphere</li>
          <li>• Include creatures, objects, or people you encountered</li>
          <li>• Talk about your emotions and the dream's mood</li>
          <li>• Describe any surreal or impossible elements</li>
        </ul>
      </GlassPanel>
    </div>
  )
}

/**
 * Phase 3: Interpreting state
 */
const PhaseInterpreting: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 space-y-6">
      <LoadingSpinner size="lg" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-light">Interpreting Your Dream</h2>
        <p className="text-white/60">Creating your dream world...</p>
      </div>
    </div>
  )
}

/**
 * Phase 4: Viewing state
 */
interface PhaseViewingProps {
  scene: any
  dreamMap: any
  renderMode: '2d' | '3d'
  onRenderModeChange: (mode: '2d' | '3d') => void
  onShare: () => void
  onExport: () => void
  onExplore: () => void
}

const PhaseViewing: React.FC<PhaseViewingProps> = ({
  scene,
  dreamMap,
  renderMode,
  onRenderModeChange,
  onShare,
  onExport,
  onExplore,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dream info and controls */}
      <GlassCard>
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-light mb-2">{dreamMap.title}</h2>
            <p className="text-white/60 text-sm line-clamp-3">{dreamMap.narration}</p>
          </div>

          <GlassDivider />

          {/* Dream metadata */}
          <div className="flex flex-wrap gap-2">
            <GlassBadge color="bg-dream-blue">{scene.mood}</GlassBadge>
            {scene.colors.slice(0, 3).map((color: string, idx: number) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full border border-white/20"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <GlassDivider />

          {/* Control buttons */}
          <div className="flex flex-wrap gap-3">
            <GlassButton
              variant={renderMode === '3d' ? 'primary' : 'secondary'}
              onClick={() => onRenderModeChange('3d')}
              size="sm"
            >
              3D View
            </GlassButton>
            <GlassButton
              variant={renderMode === '2d' ? 'primary' : 'secondary'}
              onClick={() => onRenderModeChange('2d')}
              size="sm"
            >
              2D View
            </GlassButton>

            <div className="flex-1" />

            <GlassButton variant="secondary" onClick={onShare} size="sm">
              🔗 Share
            </GlassButton>
            <GlassButton variant="secondary" onClick={onExport} size="sm">
              📥 Export
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Dream world renderer */}
      <GlassPanel className="p-0 overflow-hidden">
        {renderMode === '3d' ? (
          <Dream3DRenderer scene={scene} onExplore={onExplore} />
        ) : (
          <Dream2DRenderer scene={scene} />
        )}
      </GlassPanel>

      {/* Dream elements */}
      <GlassCard>
        <h3 className="text-lg font-light mb-4">Dream Elements</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scene.elements.map((element: any) => (
            <div
              key={element.id}
              className="p-3 rounded-lg bg-black/30 border border-white/10"
            >
              <div className="font-medium text-sm">{element.name}</div>
              <div className="text-xs text-white/50 mt-1">{element.type}</div>
              <div
                className="w-4 h-4 rounded mt-2"
                style={{ backgroundColor: element.color }}
              />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

export default App
