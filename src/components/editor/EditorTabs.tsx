import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEditorStore } from '@/stores/editor.store'

export function EditorTabs() {
  const { openFiles, activeTabId, setActiveTab, closeFile } = useEditorStore()

  if (openFiles.length === 0) {
    return null
  }

  return (
    <View className="bg-dark-300 border-b border-dark-300">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle="flex-row p-1 gap-1"
      >
        {openFiles.map((file) => (
          <TouchableOpacity
            key={file.id}
            className={`flex-row items-center px-3 py-2 rounded-md gap-1.5 max-w-[160px] ${file.id === activeTabId ? 'bg-primary' : 'bg-dark-200'}`}
            onPress={() => setActiveTab(file.id)}
          >
            <Text
              className={`text-[13px] ${file.id === activeTabId ? 'text-white' : 'text-gray-400'}`}
              numberOfLines={1}
            >
              {file.name}
            </Text>
            {file.isDirty && (
              <View className="w-2 h-2 rounded-full bg-accent-yellow" />
            )}
            <TouchableOpacity
              className="p-0.5"
              onPress={(e) => {
                e.stopPropagation()
                closeFile(file.id)
              }}
            >
              <MaterialCommunityIcons
                name="close"
                size={14}
                color={file.id === activeTabId ? '#fff' : '#8888aa'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}
