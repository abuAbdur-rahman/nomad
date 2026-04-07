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

export interface GitChange {
  path: string
  status: 'modified' | 'added' | 'deleted' | 'untracked'
  staged: boolean
}

export interface Commit {
  hash: string
  message: string
  author: string
  date: number
}

interface GitState {
  branch: string
  changes: GitChange[]
  staged: Set<string>
  lastCommits: Commit[]
  remotes: string[]
  isRepo: boolean
}

interface GitActions {
  setBranch: (branch: string) => void
  setChanges: (changes: GitChange[]) => void
  stageFile: (path: string) => void
  unstageFile: (path: string) => void
  stageAll: () => void
  unstageAll: () => void
  setCommits: (commits: Commit[]) => void
  setIsRepo: (isRepo: boolean) => void
}

export const useGitStore = create<GitState & GitActions>()(
  persist(
    (set, get) => ({
      branch: 'main',
      changes: [],
      staged: new Set<string>(),
      lastCommits: [],
      remotes: [],
      isRepo: false,

      setBranch: (branch) => set({ branch }),
      setChanges: (changes) => set({ changes }),

      stageFile: (path) => {
        const { staged, changes } = get()
        set({
          staged: new Set([...staged, path]),
          changes: changes.map((c) =>
            c.path === path ? { ...c, staged: true } : c
          ),
        })
      },

      unstageFile: (path) => {
        const { staged, changes } = get()
        const newStaged = new Set(staged)
        newStaged.delete(path)

        set({
          staged: newStaged,
          changes: changes.map((c) =>
            c.path === path ? { ...c, staged: false } : c
          ),
        })
      },

      stageAll: () => {
        const { changes } = get()
        set({
          staged: new Set(changes.map((c) => c.path)),
          changes: changes.map((c) => ({ ...c, staged: true })),
        })
      },

      unstageAll: () => {
        set({
          staged: new Set<string>(),
          changes: changes.map((c) => ({ ...c, staged: false })),
        })
      },

      setCommits: (commits) => set({ lastCommits: commits }),
      setIsRepo: (isRepo) => set({ isRepo }),
    }),
    {
      name: 'git-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        branch: state.branch,
      }),
    }
  )
)
