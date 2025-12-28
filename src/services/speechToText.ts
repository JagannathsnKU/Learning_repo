/**
 * Speech-to-text service using Web Speech API
 * Provides voice recording and transcription capabilities
 */

export interface SpeechToTextConfig {
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition

export class SpeechToTextService {
  private recognition: any
  private isListening: boolean = false
  private transcript: string = ''
  private interimTranscript: string = ''
  private onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void
  private onError?: (error: string) => void

  constructor(config: SpeechToTextConfig = {}) {
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition API not supported in this browser')
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = config.continuous || false
    this.recognition.interimResults = config.interimResults || true
    this.recognition.language = config.language || 'en-US'

    this.setupListeners()
  }

  private setupListeners(): void {
    this.recognition.onstart = () => {
      this.isListening = true
    }

    this.recognition.onresult = (event: any) => {
      this.interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          this.transcript += transcript + ' '
        } else {
          this.interimTranscript += transcript
        }
      }

      const fullTranscript = this.transcript + this.interimTranscript
      this.onTranscriptUpdate?.(fullTranscript, false)
    }

    this.recognition.onerror = (event: any) => {
      const errorMap: Record<string, string> = {
        'no-speech': 'No speech was detected. Please try again.',
        'audio-capture': 'No microphone was found. Ensure it is connected.',
        'network': 'Network error occurred.',
        'not-allowed': 'Microphone access was denied.',
      }

      const errorMessage = errorMap[event.error] || `Speech recognition error: ${event.error}`
      this.onError?.(errorMessage)
    }

    this.recognition.onend = () => {
      this.isListening = false
      // Mark final transcript
      if (this.transcript.trim()) {
        this.onTranscriptUpdate?.(this.transcript.trim(), true)
      }
    }
  }

  public start(): void {
    if (this.isListening) return

    this.transcript = ''
    this.interimTranscript = ''
    this.recognition.start()
  }

  public stop(): string {
    this.recognition.stop()
    return this.transcript.trim()
  }

  public abort(): void {
    this.recognition.abort()
    this.transcript = ''
    this.interimTranscript = ''
  }

  public setOnTranscriptUpdate(callback: (transcript: string, isFinal: boolean) => void): void {
    this.onTranscriptUpdate = callback
  }

  public setOnError(callback: (error: string) => void): void {
    this.onError = callback
  }

  public getTranscript(): string {
    return this.transcript.trim()
  }

  public isActive(): boolean {
    return this.isListening
  }
}

export function createSpeechToTextService(config?: SpeechToTextConfig): SpeechToTextService {
  try {
    return new SpeechToTextService(config)
  } catch (error) {
    console.error('Failed to initialize Speech-to-Text:', error)
    throw error
  }
}
