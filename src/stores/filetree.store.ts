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

export interface FileNode {
  id: string
  name: string
  path: string
  isDirectory: boolean
  children?: FileNode[]
}

interface FileTreeState {
  tree: FileNode[]
  expandedPaths: Set<string>
  selectedPath: string | null
  currentProjectPath: string | null
}

interface FileTreeActions {
  setTree: (tree: FileNode[]) => void
  toggleExpanded: (path: string) => void
  setSelected: (path: string | null) => void
  setProjectPath: (path: string | null) => void
  refresh: () => void
}

export const useFileTreeStore = create<FileTreeState & FileTreeActions>()(
  persist(
    (set, get) => ({
      tree: [],
      expandedPaths: new Set<string>(),
      selectedPath: null,
      currentProjectPath: null,

      setTree: (tree) => set({ tree }),

      toggleExpanded: (path) => {
        const { expandedPaths } = get()
        const newExpanded = new Set(expandedPaths)
        
        if (newExpanded.has(path)) {
          newExpanded.delete(path)
        } else {
          newExpanded.add(path)
        }
        
        set({ expandedPaths: newExpanded })
      },

      setSelected: (path) => set({ selectedPath: path }),
      setProjectPath: (path) => set({ currentProjectPath: path }),
      refresh: () => {
        // Will be connected to FS service
      },
    }),
    {
      name: 'filetree-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        currentProjectPath: state.currentProjectPath,
      }),
    }
  )
)
