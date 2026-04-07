import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import '../global.css'

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1 bg-dark-100">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: 'fade',
        }}
      />
    </GestureHandlerRootView>
  )
}
