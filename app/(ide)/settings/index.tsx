import { View, Text, TouchableOpacity } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function SettingsScreen() {
  return (
    <View className="flex-1 bg-dark-100">
      <StatusBar style="light" />
      <View className="pt-[50px] px-4 pb-3 bg-dark-200">
        <Text className="text-xl font-semibold text-white">Settings</Text>
      </View>
      
      <View className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <Text className="text-sm font-semibold text-primary mb-3 uppercase">Editor</Text>
          
          <TouchableOpacity className="flex-row items-center bg-dark-200 rounded-xl p-4 mb-2">
            <MaterialCommunityIcons name="palette" size={24} color="#8888aa" />
            <Text className="flex-1 text-base text-white ml-3">Theme</Text>
            <Text className="text-sm text-gray-400">Dracula</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center bg-dark-200 rounded-xl p-4 mb-2">
            <MaterialCommunityIcons name="format-size" size={24} color="#8888aa" />
            <Text className="flex-1 text-base text-white ml-3">Font Size</Text>
            <Text className="text-sm text-gray-400">14</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center bg-dark-200 rounded-xl p-4 mb-2">
            <MaterialCommunityIcons name="tab" size={24} color="#8888aa" />
            <Text className="flex-1 text-base text-white ml-3">Tab Size</Text>
            <Text className="text-sm text-gray-400">2</Text>
          </TouchableOpacity>
        </View>
        
        <View>
          <Text className="text-sm font-semibold text-primary mb-3 uppercase">About</Text>
          
          <TouchableOpacity className="flex-row items-center bg-dark-200 rounded-xl p-4 mb-2">
            <MaterialCommunityIcons name="information" size={24} color="#8888aa" />
            <Text className="flex-1 text-base text-white ml-3">Version</Text>
            <Text className="text-sm text-gray-400">1.0.0</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
