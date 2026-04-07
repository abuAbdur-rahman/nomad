import { useEffect } from 'react'
import { View } from 'react-native'
import { router } from 'expo-router'
import { MMKV } from 'react-native-mmkv'
import { StatusBar } from 'expo-status-bar'

const storage = new MMKV({ id: 'nomad-storage' })

export default function SplashScreen() {
  useEffect(() => {
    const checkLastProject = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      const lastProject = storage.getString('lastProjectPath')
      
      if (lastProject) {
        router.replace('/(ide)/editor')
      } else {
        router.replace('/dashboard')
      }
    }

    checkLastProject()
  }, [])

  return (
    <View className="flex-1 bg-dark-100 justify-center items-center">
      <StatusBar style="light" />
    </View>
  )
}
