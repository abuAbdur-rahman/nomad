import { documentDirectory, readDirectoryAsync, readAsStringAsync, writeAsStringAsync, deleteAsync, makeDirectoryAsync, getInfoAsync, copyAsync, moveAsync } from 'expo-file-system'

const PROJECT_DIR = documentDirectory || ''

export interface FileInfo {
  name: string
  path: string
  isDirectory: boolean
  size?: number
  modificationTime?: number
}

export async function listDirectory(dirPath: string): Promise<FileInfo[]> {
  try {
    const result = await readDirectoryAsync(dirPath)
    return result.map((name) => ({
      name,
      path: `${dirPath}/${name}`,
      isDirectory: false,
    }))
  } catch (err) {
    console.error('Error listing directory:', err)
    return []
  }
}

export async function readFile(filePath: string): Promise<string | null> {
  try {
    const content = await readAsStringAsync(filePath)
    return content
  } catch (err) {
    console.error('Error reading file:', err)
    return null
  }
}

export async function writeFile(filePath: string, content: string): Promise<boolean> {
  try {
    await writeAsStringAsync(filePath, content)
    return true
  } catch (err) {
    console.error('Error writing file:', err)
    return false
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await deleteAsync(filePath)
    return true
  } catch (err) {
    console.error('Error deleting file:', err)
    return false
  }
}

export async function createDirectory(dirPath: string): Promise<boolean> {
  try {
    await makeDirectoryAsync(dirPath, { intermediates: true })
    return true
  } catch (err) {
    console.error('Error creating directory:', err)
    return false
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const info = await getInfoAsync(filePath)
    return info.exists
  } catch {
    return false
  }
}

export async function getFileInfo(filePath: string): Promise<FileInfo | null> {
  try {
    const info = await getInfoAsync(filePath)
    if (!info.exists) return null

    const name = filePath.split('/').pop() || ''
    return {
      name,
      path: filePath,
      isDirectory: info.isDirectory || false,
      size: info.size,
      modificationTime: info.modificationTime,
    }
  } catch (err) {
    console.error('Error getting file info:', err)
    return null
  }
}

export async function copyFile(source: string, destination: string): Promise<boolean> {
  try {
    await copyAsync({ from: source, to: destination })
    return true
  } catch (err) {
    console.error('Error copying file:', err)
    return false
  }
}

export async function moveFile(source: string, destination: string): Promise<boolean> {
  try {
    await moveAsync({ from: source, to: destination })
    return true
  } catch (err) {
    console.error('Error moving file:', err)
    return false
  }
}

export { PROJECT_DIR }
