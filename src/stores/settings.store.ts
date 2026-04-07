import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'nomad-storage' })

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name)
    return value ?? null
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value)
  },
  removeItem: (name: string) => {
    storage.delete(name)
  },
}

export type ThemeName = 'dracula' | 'oneDark' | 'githubLight' | 'monokai'

export interface SettingsState {
  theme: ThemeName
  font: string
  fontSize: number
  tabSize: number
  wordWrap: boolean
  minimap: boolean
  formatOnSave: boolean
  extraToolbar: boolean
  toolbarRow2: boolean
  vimMode: boolean
  gitUsername: string
  gitEmail: string
  defaultBranch: string
}

interface SettingsActions {
  setTheme: (theme: ThemeName) => void
  setFont: (font: string) => void
  setFontSize: (size: number) => void
  setTabSize: (size: number) => void
  setWordWrap: (enabled: boolean) => void
  setMinimap: (enabled: boolean) => void
  setFormatOnSave: (enabled: boolean) => void
  setExtraToolbar: (enabled: boolean) => void
  setToolbarRow2: (enabled: boolean) => void
  setVimMode: (enabled: boolean) => void
  setGitUsername: (username: string) => void
  setGitEmail: (email: string) => void
  setDefaultBranch: (branch: string) => void
  reset: () => void
}

const defaultSettings: SettingsState = {
  theme: 'dracula',
  font: 'FiraCode',
  fontSize: 14,
  tabSize: 2,
  wordWrap: false,
  minimap: true,
  formatOnSave: true,
  extraToolbar: true,
  toolbarRow2: true,
  vimMode: false,
  gitUsername: '',
  gitEmail: '',
  defaultBranch: 'main',
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTabSize: (tabSize) => set({ tabSize }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setMinimap: (minimap) => set({ minimap }),
      setFormatOnSave: (formatOnSave) => set({ formatOnSave }),
      setExtraToolbar: (extraToolbar) => set({ extraToolbar }),
      setToolbarRow2: (toolbarRow2) => set({ toolbarRow2 }),
      setVimMode: (vimMode) => set({ vimMode }),
      setGitUsername: (gitUsername) => set({ gitUsername }),
      setGitEmail: (gitEmail) => set({ gitEmail }),
      setDefaultBranch: (defaultBranch) => set({ defaultBranch }),
      reset: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)
