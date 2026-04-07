import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFileTreeStore, FileNode } from '@/stores/filetree.store'

interface FileIconProps {
  name: string
  isDirectory: boolean
}

export function FileIcon({ name, isDirectory }: FileIconProps) {
  const getIcon = () => {
    if (isDirectory) return 'folder'
    
    const ext = name.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'language-typescript'
      case 'js':
      case 'jsx':
        return 'language-javascript'
      case 'json':
        return 'code-json'
      case 'md':
        return 'language-markdown'
      case 'py':
        return 'language-python'
      case 'html':
        return 'language-html5'
      case 'css':
        return 'language-css3'
      default:
        return 'file-outline'
    }
  }

  const getColor = () => {
    if (isDirectory) return '#fbbf24'
    
    const ext = name.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'ts':
      case 'tsx':
        return '#3178c6'
      case 'js':
      case 'jsx':
        return '#f7df1e'
      case 'json':
        return '#fbbf24'
      case 'md':
        return '#083fa1'
      case 'py':
        return '#3572A5'
      default:
        return '#8888aa'
    }
  }

  return (
    <MaterialCommunityIcons 
      name={getIcon() as any} 
      size={20} 
      color={getColor()} 
    />
  )
}

interface FileNodeItemProps {
  node: FileNode
  depth: number
}

export function FileNodeItem({ node, depth }: FileNodeItemProps) {
  const { expandedPaths, selectedPath, toggleExpanded, setSelected } = useFileTreeStore()
  const isExpanded = expandedPaths.has(node.path)
  const isSelected = selectedPath === node.path

  const handlePress = () => {
    setSelected(node.path)
    if (node.isDirectory) {
      toggleExpanded(node.path)
    }
  }

  return (
    <TouchableOpacity
      className={`flex-row items-center py-2 px-2 ${isSelected ? 'bg-dark-300' : ''}`}
      style={{ paddingLeft: depth * 16 + 8 }}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {node.isDirectory && (
        <MaterialCommunityIcons 
          name={isExpanded ? 'chevron-down' : 'chevron-right'} 
          size={18} 
          color="#8888aa" 
        />
      )}
      <FileIcon name={node.name} isDirectory={node.isDirectory} />
      <Text className="text-sm text-white ml-2 flex-1" numberOfLines={1}>
        {node.name}
      </Text>
    </TouchableOpacity>
  )
}
