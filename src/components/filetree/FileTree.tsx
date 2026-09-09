import { useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { useFileTreeStore, FileNode } from '@/stores/filetree.store'
import { FileNodeItem } from './FileNode'

interface FileTreeProps {
  onFileSelect?: (path: string) => void
}

export function FileTree({ onFileSelect }: FileTreeProps) {
  const { tree, selectedPath } = useFileTreeStore()

  const renderNode = (node: FileNode, depth: number = 0): React.ReactNode => {
    return (
      <FileNodeItem 
        key={node.id} 
        node={node} 
        depth={depth} 
      />
    )
  }

  const flattenTree = (nodes: FileNode[], depth: number = 0): FileNode[] => {
    let flat: FileNode[] = []
    for (const node of nodes) {
      flat.push(node)
      if (node.isDirectory && node.children) {
        flat = flat.concat(flattenTree(node.children, depth + 1))
      }
    }
    return flat
  }

  const flatNodes = flattenTree(tree)

  if (tree.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <Text className="text-dark-500 text-sm">No files in project</Text>
      </View>
    )
  }

  return (
    <View className="flex-1">
      <FlashList
        data={flatNodes}
        renderItem={({ item }) => (
          <FileNodeItem node={item} depth={0} />
        )}
        estimatedItemSize={40}
      />
    </View>
  )
}
