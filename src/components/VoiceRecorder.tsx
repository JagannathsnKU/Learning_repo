import React, { useState, useRef, useEffect } from 'react'
import { GlassButton, GlassCard, GlassInput, LoadingSpinner } from './GlassUI'

/**
 * VoiceRecorder Component
 * Handles microphone input, speech-to-text conversion, and live transcription display
 */

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcript: string) => void
  isProcessing?: boolean
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
  isProcessing = false,
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [manualInput, setManualInput] = useState('')
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionStartedRef = useRef(false)

  useEffect(() => {
    // Initialize Web Speech API - only run once
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in your browser. Using text input instead.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.language = 'en-US'

    recognition.onstart = () => {
      console.log('[VoiceRecorder] Recognition started')
      recognitionStartedRef.current = true
      setError(null)
    }

    recognition.onresult = (event: any) => {
      console.log('[VoiceRecorder] Result event received', { resultIndex: event.resultIndex, resultsLength: event.results.length })
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          final += transcriptPart + ' '
        } else {
          interim += transcriptPart
        }
      }

      setTranscript((prev) => prev + final)
      setInterimTranscript(interim)
    }

    recognition.onerror = (event: any) => {
      console.error('[VoiceRecorder] Error event:', event.error)
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'No microphone found. Please check your device.',
        'not-allowed': 'Microphone access denied. Please enable it in settings.',
        'network': 'Network error. Please try again.',
      }

      setError(errorMessages[event.error] || `Error: ${event.error}`)
      setIsRecording(false)
      recognitionStartedRef.current = false
    }

    recognition.onend = () => {
      console.log('[VoiceRecorder] Recognition ended')
      setIsRecording(false)
      recognitionStartedRef.current = false
    }

    recognitionRef.current = recognition

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  // Handle transcription completion when recording stops
  useEffect(() => {
    if (!isRecording && (transcript.trim() || interimTranscript.trim())) {
      const finalTranscript = (transcript + interimTranscript).trim()
      if (finalTranscript && recognitionStartedRef.current === false) {
        // Only call once when recording has stopped
        onTranscriptionComplete(finalTranscript)
      }
    }
  }, [isRecording, transcript, interimTranscript, onTranscriptionComplete])

  const handleStartRecording = async () => {
    try {
      setTranscript('')
      setInterimTranscript('')
      setRecordingTime(0)
      setError(null)

      if (recognitionRef.current) {
        console.log('[VoiceRecorder] Starting recognition...')
        recognitionRef.current.start()
        setIsRecording(true)

        // Timer for recording duration
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      }
    } catch (err) {
      console.error('[VoiceRecorder] Error starting recording:', err)
      setError('Failed to start recording. Please try again.')
      setIsRecording(false)
    }
  }

  const handleStopRecording = () => {
    console.log('[VoiceRecorder] Stopping recognition...')
    if (timerRef.current) clearInterval(timerRef.current)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('[VoiceRecorder] Error stopping recognition:', err)
        recognitionRef.current.abort()
      }
    }
    setIsRecording(false)
  }

  const handleClear = () => {
    setTranscript('')
    setInterimTranscript('')
    setManualInput('')
    setRecordingTime(0)
    setError(null)
  }

  // Use manual input if available, otherwise use voice transcript
  const displayTranscript = manualInput || (transcript + interimTranscript).trim()
  const fullTranscript = displayTranscript.trim()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full space-y-4">
      <GlassCard>
        <div className="space-y-4">
          {/* Recording Controls */}
          <div className="flex gap-3 items-center justify-between">
            <div className="flex gap-3 flex-1">
              <GlassButton
                variant={isRecording ? 'secondary' : 'primary'}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {isRecording ? (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                      <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.7 2.36-2.2 0-4.2-.9-5.7-2.36M19 21H5v-2h14v2z" />
                    </svg>
                    Start Recording
                  </>
                )}
              </GlassButton>

              {isRecording && (
                <div className="px-4 py-2 rounded-lg bg-glass-light text-white text-sm flex items-center">
                  {formatTime(recordingTime)}
                </div>
              )}
            </div>

            {fullTranscript && (
              <GlassButton
                variant="ghost"
                onClick={handleClear}
                size="sm"
              >
                Clear
              </GlassButton>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Transcription Display */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Transcription
            </label>
            <div className="bg-black/20 rounded-lg p-4 min-h-24 border border-white/5">
              {fullTranscript ? (
                <div className="space-y-2">
                  <p className="text-white leading-relaxed">{transcript}</p>
                  {interimTranscript && (
                    <p className="text-white/40 italic leading-relaxed">{interimTranscript}</p>
                  )}
                </div>
              ) : (
                <p className="text-white/30 italic">
                  {isRecording
                    ? 'Listening... speak to describe your dream'
                    : 'Click "Start Recording" to describe your dream'}
                </p>
              )}
            </div>
          </div>

          {/* Character count */}
          <div className="text-xs text-white/40 text-right">
            {fullTranscript.length} characters
          </div>

          {/* Manual text input fallback */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Or paste/type directly
            </label>
            <GlassInput
              value={manualInput}
              onChange={setManualInput}
              placeholder="Enter your dream description here..."
              className="text-sm"
            />
          </div>
        </div>
      </GlassCard>

      {/* Submit Button */}
      <GlassButton
        onClick={() => {
          if (fullTranscript) {
            onTranscriptionComplete(fullTranscript)
          }
        }}
        disabled={!fullTranscript || isProcessing}
        className="w-full flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <LoadingSpinner size="sm" />
            Interpreting Dream...
          </>
        ) : (
          <>
            ✨ Interpret Dream
          </>
        )}
      </GlassButton>
    </div>
  )
}
