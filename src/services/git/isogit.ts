import git from 'isomorphic-git'
import http from 'isomorphic-git/http/web'

const FS = {
  promises: {
    readFile: async (filepath: string) => {
      const content = await window._fsReadFile(filepath)
      return new TextDecoder().decode(content)
    },
    writeFile: async (filepath: string, data: string) => {
      await window._fsWriteFile(filepath, new TextEncoder().encode(data))
    },
    mkdir: async (filepath: string) => {
      await window._fsMkdir(filepath)
    },
    rmdir: async (filepath: string) => {
      await window._fsRmdir(filepath)
    },
    unlink: async (filepath: string) => {
      await window._fsUnlink(filepath)
    },
    readdir: async (filepath: string) => {
      return await window._fsReaddir(filepath)
    },
    stat: async (filepath: string) => {
      return await window._fsStat(filepath)
    },
    lstat: async (filepath: string) => {
      return await window._fsStat(filepath)
    },
  },
}

declare global {
  interface Window {
    _fsReadFile: (path: string) => Promise<ArrayBuffer>
    _fsWriteFile: (path: string, data: ArrayBuffer) => Promise<void>
    _fsMkdir: (path: string) => Promise<void>
    _fsRmdir: (path: string) => Promise<void>
    _fsUnlink: (path: string) => Promise<void>
    _fsReaddir: (path: string) => Promise<string[]>
    _fsStat: (path: string) => Promise<{ isDirectory: () => boolean; isFile: () => boolean; size: number; mtimeMs: number }>
  }
}

export interface GitCredentials {
  username: string
  password: string
}

export interface CloneOptions {
  url: string
  path: string
  credentials?: GitCredentials
  onProgress?: (progress: any) => void
}

export interface CommitOptions {
  path: string
  message: string
  author: {
    name: string
    email: string
  }
}

export interface PushOptions {
  path: string
  credentials?: GitCredentials
  onProgress?: (progress: any) => void
}

export interface PullOptions {
  path: string
  credentials?: GitCredentials
  author: {
    name: string
    email: string
  }
}

export interface StatusOptions {
  path: string
  filepaths?: string[]
}

export async function clone(options: CloneOptions): Promise<void> {
  const { url, path, credentials, onProgress } = options

  await git.clone({
    fs: FS,
    http,
    url,
    dir: path,
    corsProxy: 'https://cors.isomorphic-git.org',
    onProgress,
    singleBranch: true,
    depth: 10,
  })
}

export async function initRepo(dirPath: string): Promise<void> {
  await git.init({ fs: FS, dir: dirPath })
}

export async function status(options: StatusOptions): Promise<{ [key: string]: string }> {
  const { path: dir, filepaths } = options

  const statuses: { [key: string]: string } = {}
  const files = filepaths || await FS.promises.readdir(dir)

  for (const file of files) {
    try {
      const result = await git.status({ fs: FS, dir, filepath: file })
      statuses[file] = result
    } catch (e) {
      // File might be untracked
      statuses[file] = 'untracked'
    }
  }

  return statuses
}

export async function add(dirPath: string, filepaths: string[]): Promise<void> {
  for (const filepath of filepaths) {
    await git.add({ fs: FS, dir: dirPath, filepath })
  }
}

export async function commit(options: CommitOptions): Promise<string> {
  const { path: dir, message, author } = options

  const sha = await git.commit({
    fs: FS,
    dir,
    message,
    author,
    committer: author,
  })

  return sha
}

export async function push(options: PushOptions): Promise<void> {
  const { path: dir, credentials, onProgress } = options

  await git.push({
    fs: FS,
    http,
    dir,
    corsProxy: 'https://cors.isomorphic-git.org',
    onProgress,
  })
}

export async function pull(options: PullOptions): Promise<void> {
  const { path: dir, credentials, author } = options

  await git.pull({
    fs: FS,
    http,
    dir,
    corsProxy: 'https://cors.isomorphic-git.org',
    author,
    committer: author,
  })
}

export async function log(dirPath: string, depth: number = 10): Promise<any[]> {
  const commits = await git.log({
    fs: FS,
    dir: dirPath,
    depth,
  })

  return commits
}

export async function branch(dirPath: string): Promise<string> {
  const currentBranch = await git.currentBranch({ fs: FS, dir: dirPath })
  return currentBranch || 'main'
}

export async function listBranches(dirPath: string): Promise<string[]> {
  const branches = await git.listBranches({ fs: FS, dir: dirPath })
  return branches
}

export async function checkout(dirPath: string, ref: string): Promise<void> {
  await git.checkout({
    fs: FS,
    dir: dirPath,
    ref,
  })
}

export async function isRepo(dirPath: string): Promise<boolean> {
  try {
    await git.findRoot({ fs: FS, fsWindow: FS, filepath: dirPath })
    return true
  } catch {
    return false
  }
}

export async function getRemoteBranches(dirPath: string): Promise<string[]> {
  try {
    const remotes = await git.listRemotes({ fs: FS, dir: dirPath })
    return remotes
  } catch {
    return []
  }
}

export { git, http }
