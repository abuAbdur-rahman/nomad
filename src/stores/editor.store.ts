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

export interface FileTab {
  id: string
  path: string
  name: string
  content: string
  isDirty: boolean
  language: string
}

interface EditorState {
  openFiles: FileTab[]
  activeTabId: string | null
  unsavedIds: Set<string>
  fontSize: number
  theme: string
}

interface EditorActions {
  openFile: (path: string, name: string, content: string, language: string) => void
  closeFile: (id: string) => void
  setActiveTab: (id: string) => void
  updateContent: (id: string, content: string) => void
  markDirty: (id: string) => void
  markSaved: (id: string) => void
  setFontSize: (size: number) => void
  setTheme: (theme: string) => void
}

export const useEditorStore = create<EditorState & EditorActions>()(
  persist(
    (set, get) => ({
      openFiles: [],
      activeTabId: null,
      unsavedIds: new Set(),
      fontSize: 14,
      theme: 'dracula',

      openFile: (path, name, content, language) => {
        const { openFiles } = get()
        const existing = openFiles.find((f) => f.path === path)
        
        if (existing) {
          set({ activeTabId: existing.id })
          return
        }

        const newTab: FileTab = {
          id: Date.now().toString(),
          path,
          name,
          content,
          isDirty: false,
          language,
        }

        set({
          openFiles: [...openFiles, newTab],
          activeTabId: newTab.id,
        })
      },

      closeFile: (id) => {
        const { openFiles, activeTabId } = get()
        const newOpenFiles = openFiles.filter((f) => f.id !== id)
        const newUnsavedIds = new Set(get().unsavedIds)
        newUnsavedIds.delete(id)

        let newActiveTabId = activeTabId
        if (activeTabId === id) {
          const index = openFiles.findIndex((f) => f.id === id)
          newActiveTabId = newOpenFiles[index]?.id ?? newOpenFiles[index - 1]?.id ?? null
        }

        set({
          openFiles: newOpenFiles,
          activeTabId: newActiveTabId,
          unsavedIds: newUnsavedIds,
        })
      },

      setActiveTab: (id) => set({ activeTabId: id }),

      updateContent: (id, content) => {
        const { openFiles, unsavedIds } = get()
        set({
          openFiles: openFiles.map((f) =>
            f.id === id ? { ...f, content } : f
          ),
          unsavedIds: new Set([...unsavedIds, id]),
        })
      },

      markDirty: (id) => {
        const { unsavedIds } = get()
        set({ unsavedIds: new Set([...unsavedIds, id]) })
      },

      markSaved: (id) => {
        const { unsavedIds, openFiles } = get()
        const newUnsavedIds = new Set(unsavedIds)
        newUnsavedIds.delete(id)

        set({
          unsavedIds: newUnsavedIds,
          openFiles: openFiles.map((f) =>
            f.id === id ? { ...f, isDirty: false } : f
          ),
        })
      },

      setFontSize: (size) => set({ fontSize: size }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'editor-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        fontSize: state.fontSize,
        theme: state.theme,
      }),
    }
  )
)
