import { create } from 'zustand'

interface AppState {
  selectedParticle: number | null
  setSelectedParticle: (index: number | null) => void
  isQuerying: boolean
  setIsQuerying: (isQuerying: boolean) => void
  focusTarget: [number, number, number] | null
  setFocusTarget: (target: [number, number, number] | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedParticle: null,
  setSelectedParticle: (index) => set({ selectedParticle: index }),
  isQuerying: false,
  setIsQuerying: (isQuerying) => set({ isQuerying }),
  focusTarget: null,
  setFocusTarget: (target) => set({ focusTarget: target }),
}))
