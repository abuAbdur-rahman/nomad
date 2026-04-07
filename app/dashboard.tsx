import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'nomad-storage' })

interface Project {
  name: string
  path: string
  lastOpened: number
}

export default function Dashboard() {
  const router = useRouter()

  const recentProjects: Project[] = []

  const handleOpenProject = (project: Project) => {
    storage.set('lastProjectPath', project.path)
    router.push('/(ide)/editor')
  }

  const handleNewProject = () => {
    router.push('/(ide)/editor')
  }

  const handleCloneRepo = () => {
    router.push('/(ide)/editor')
  }

  const handleOpenFolder = () => {
    router.push('/(ide)/editor')
  }

  return (
    <View className="flex-1 bg-dark-100">
      <StatusBar style="light" />
      
      <View className="pt-[60px] px-5 pb-5">
        <Text className="text-3xl font-bold text-white">Nomad</Text>
        <Text className="text-base text-gray-400 mt-1">Your mobile IDE</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-semibold text-white mb-4">Recent Projects</Text>
        
        {recentProjects.length === 0 ? (
          <View className="items-center py-10">
            <MaterialCommunityIcons name="folder-outline" size={64} color="#4a4a6a" />
            <Text className="text-lg text-gray-400 mt-4">No recent projects</Text>
            <Text className="text-sm text-dark-500 mt-2 text-center">Open a folder or clone a repository to get started</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3 mb-6">
            {recentProjects.map((project, index) => (
              <TouchableOpacity
                key={index}
                className="w-[47%] bg-dark-200 rounded-xl p-4 items-center"
                onPress={() => handleOpenProject(project)}
              >
                <MaterialCommunityIcons name="folder" size={32} color="#6366f1" />
                <Text className="text-sm text-white mt-2 text-center" numberOfLines={1}>
                  {project.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="gap-3 mb-10">
          <TouchableOpacity className="flex-row items-center bg-primary rounded-xl p-4 gap-3" onPress={handleNewProject}>
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
            <Text className="text-base font-semibold text-white">New Project</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-primary rounded-xl p-4 gap-3" onPress={handleCloneRepo}>
            <MaterialCommunityIcons name="source-branch" size={24} color="#fff" />
            <Text className="text-base font-semibold text-white">Clone Repository</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-primary rounded-xl p-4 gap-3" onPress={handleOpenFolder}>
            <MaterialCommunityIcons name="folder-open" size={24} color="#fff" />
            <Text className="text-base font-semibold text-white">Open Folder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
