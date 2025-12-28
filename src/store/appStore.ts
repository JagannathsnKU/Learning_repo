import { create } from 'zustand'
import type { AppState, DreamMap, RecorderState, InterpreterState } from '../types'

interface AppStore extends AppState {
  setCurrentDreamMap: (dreamMap: DreamMap | null) => void
  setCurrentSceneIndex: (index: number) => void
  setRenderMode: (mode: '2d' | '3d') => void
  setRecorderState: (state: Partial<RecorderState>) => void
  setInterpreterState: (state: Partial<InterpreterState>) => void
  setIsExploring: (exploring: boolean) => void
  setShareToken: (token: string | null) => void
  resetApp: () => void
}

const initialRecorderState: RecorderState = {
  isRecording: false,
  transcript: '',
  duration: 0,
  isProcessing: false,
}

const initialInterpreterState: InterpreterState = {
  isInterpreting: false,
  dreamMap: null,
  error: null,
}

export const useAppStore = create<AppStore>((set) => ({
  currentDreamMap: null,
  currentSceneIndex: 0,
  renderMode: '3d',
  recorderState: initialRecorderState,
  interpreterState: initialInterpreterState,
  shareToken: null,
  isExploring: false,

  setCurrentDreamMap: (dreamMap) => set({ currentDreamMap: dreamMap }),
  setCurrentSceneIndex: (index) => set({ currentSceneIndex: index }),
  setRenderMode: (mode) => set({ renderMode: mode }),
  setRecorderState: (state) =>
    set((current) => ({
      recorderState: { ...current.recorderState, ...state },
    })),
  setInterpreterState: (state) =>
    set((current) => ({
      interpreterState: { ...current.interpreterState, ...state },
    })),
  setIsExploring: (exploring) => set({ isExploring: exploring }),
  setShareToken: (token) => set({ shareToken: token }),
  resetApp: () => set({
    currentDreamMap: null,
    currentSceneIndex: 0,
    renderMode: '3d',
    recorderState: initialRecorderState,
    interpreterState: initialInterpreterState,
    shareToken: null,
    isExploring: false,
  }),
}))
