import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'

export interface SAFDocument {
  uri: string
  name: string
  type: string | null
}

let persistedUri: string | null = null

export async function pickDirectory(): Promise<SAFDocument | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: false,
    })
    
    if (result.canceled || !result.fileInfos[0]) {
      return null
    }

    const uri = result.fileInfos[0].uri
    persistedUri = uri
    return {
      uri,
      name: uri.split('/').pop() || 'Unknown',
      type: result.fileInfos[0].type || null,
    }
  } catch (error) {
    console.error('Error picking directory:', error)
    return null
  }
}

export async function listSAFDirectory(dirUri: string): Promise<any[]> {
  try {
    const result = await FileSystem.readDirectoryAsync(dirUri)
    return result.map((name) => ({
      name,
      path: `${dirUri}/${name}`,
      isDirectory: false,
    }))
  } catch (error) {
    console.error('Error listing SAF directory:', error)
    return []
  }
}

export async function readSAFFile(fileUri: string): Promise<string | null> {
  try {
    const content = await FileSystem.readAsStringAsync(fileUri)
    return content
  } catch (error) {
    console.error('Error reading SAF file:', error)
    return null
  }
}

export async function writeSAFFile(fileUri: string, content: string): Promise<boolean> {
  try {
    await FileSystem.writeAsStringAsync(fileUri, content)
    return true
  } catch (error) {
    console.error('Error writing SAF file:', error)
    return false
  }
}

export function getPersistedUri(): string | null {
  return persistedUri
}

export function setPersistedUri(uri: string) {
  persistedUri = uri
}
