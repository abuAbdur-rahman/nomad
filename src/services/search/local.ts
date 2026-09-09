import Fuse from 'fuse.js'

export interface SearchResult {
  path: string
  line: number
  content: string
  matches?: any[]
}

export interface SearchOptions {
  query: string
  paths?: string[]
  caseSensitive?: boolean
  regex?: boolean
  word?: boolean
  maxResults?: number
}

const fuseOptions: Fuse.IFuseOptions<any> = {
  keys: ['content'],
  includeMatches: true,
  threshold: 0.4,
  ignoreLocation: true,
}

class SearchIndex {
  private files: Map<string, string> = new Map()
  private fuse: Fuse<any> | null = null

  addFile(path: string, content: string) {
    this.files.set(path, content)
    this.rebuildIndex()
  }

  removeFile(path: string) {
    this.files.delete(path)
    this.rebuildIndex()
  }

  updateFile(path: string, content: string) {
    this.files.set(path, content)
    this.rebuildIndex()
  }

  clear() {
    this.files.clear()
    this.fuse = null
  }

  private rebuildIndex() {
    const fileArray = Array.from(this.files.entries()).map(([path, content]) => ({
      path,
      content,
    }))

    this.fuse = new Fuse(fileArray, fuseOptions)
  }

  search(query: string, maxResults: number = 50): SearchResult[] {
    if (!this.fuse || !query.trim()) {
      return []
    }

    const results = this.fuse.search(query, { limit: maxResults })
    
    return results.map((result) => ({
      path: result.item.path,
      line: 1,
      content: result.item.content.slice(0, 200),
      matches: result.matches,
    }))
  }
}

export const searchIndex = new SearchIndex()

export function buildIndex(fileContents: Map<string, string>) {
  searchIndex.clear()
  
  for (const [path, content] of fileContents) {
    searchIndex.addFile(path, content)
  }
}

export function search(options: SearchOptions): SearchResult[] {
  const { query, maxResults = 50, caseSensitive = false, regex = false } = options

  if (!query.trim()) {
    return []
  }

  return searchIndex.search(query, maxResults)
}

export function searchInFile(content: string, query: string, caseSensitive: boolean = false): number[] {
  const lines = content.split('\n')
  const matchingLines: number[] = []

  const flags = caseSensitive ? 'g' : 'gi'
  const regex = new RegExp(query, flags)

  lines.forEach((line, index) => {
    if (regex.test(line)) {
      matchingLines.push(index + 1)
    }
  })

  return matchingLines
}
