import { Tabs } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { View } from 'react-native'

export default function IdeLayout() {
  return (
    <View className="flex-1 bg-dark-100">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#252542',
            borderTopColor: '#1a1a2e',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#4a4a6a',
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="editor"
          options={{
            href: '/(ide)/editor',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="code-tags" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="git"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="source-branch" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings/index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  )
}
