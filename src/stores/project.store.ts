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

export interface Project {
  name: string
  path: string
  lastOpened: number
}

interface ProjectState {
  activeProject: Project | null
  recentProjects: Project[]
}

interface ProjectActions {
  setActiveProject: (project: Project | null) => void
  addRecentProject: (project: Project) => void
  removeRecentProject: (path: string) => void
  clearRecentProjects: () => void
}

export const useProjectStore = create<ProjectState & ProjectActions>()(
  persist(
    (set, get) => ({
      activeProject: null,
      recentProjects: [],

      setActiveProject: (project) => {
        set({ activeProject: project })
        if (project) {
          get().addRecentProject(project)
        }
      },

      addRecentProject: (project) => {
        const { recentProjects } = get()
        const filtered = recentProjects.filter((p) => p.path !== project.path)
        const updated = [project, ...filtered].slice(0, 10)
        set({ recentProjects: updated })
      },

      removeRecentProject: (path) => {
        const { recentProjects } = get()
        set({ recentProjects: recentProjects.filter((p) => p.path !== path) })
      },

      clearRecentProjects: () => set({ recentProjects: [] }),
    }),
    {
      name: 'project-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
)
