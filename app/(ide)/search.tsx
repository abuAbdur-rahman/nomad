import { View, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'

export default function SearchScreen() {
  return (
    <View className="flex-1 bg-dark-100">
      <StatusBar style="light" />
      <View className="pt-[50px] px-4 pb-3 bg-dark-200">
        <Text className="text-xl font-semibold text-white">Search</Text>
      </View>
      <View className="flex-1 justify-center items-center">
        <Text className="text-base text-dark-500">Search functionality coming soon</Text>
      </View>
    </View>
  )
}
