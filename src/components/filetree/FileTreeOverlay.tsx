import { useCallback, useMemo, useRef } from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { FileTree } from './FileTree'
import { useFileTreeStore } from '@/stores/filetree.store'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75

interface FileTreeOverlayProps {
  visible: boolean
  onClose: () => void
}

export function FileTreeOverlay({ visible, onClose }: FileTreeOverlayProps) {
  const translateX = useSharedValue(-DRAWER_WIDTH)
  const { currentProjectPath, tree } = useFileTreeStore()
  
  const projectName = currentProjectPath?.split('/').pop() || 'Project'

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newValue = Math.max(-DRAWER_WIDTH, Math.min(0, -DRAWER_WIDTH + event.translationX))
      translateX.value = newValue
    })
    .onEnd((event) => {
      if (event.translationX > DRAWER_WIDTH * 0.5) {
        translateX.value = withSpring(0)
      } else {
        translateX.value = withSpring(-DRAWER_WIDTH)
        runOnJS(onClose)()
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const open = useCallback(() => {
    translateX.value = withSpring(0)
  }, [])

  const close = useCallback(() => {
    translateX.value = withSpring(-DRAWER_WIDTH)
    onClose()
  }, [])

  if (!visible) return null

  return (
    <View className="absolute inset-0 z-50">
      <TouchableOpacity 
        className="absolute inset-0 bg-black/50" 
        onPress={close}
        activeOpacity={1}
      />
      
      <GestureDetector gesture={panGesture}>
        <Animated.View 
          className="absolute top-0 left-0 bottom-0 bg-dark-200"
          style={[
            { width: DRAWER_WIDTH },
            animatedStyle
          ]}
        >
          <View className="pt-[50px] px-4 pb-3 border-b border-dark-300">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="folder" size={24} color="#fbbf24" />
                <Text className="text-lg font-semibold text-white" numberOfLines={1}>
                  {projectName}
                </Text>
              </View>
              <TouchableOpacity className="p-2" onPress={close}>
                <MaterialCommunityIcons name="close" size={20} color="#8888aa" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-1">
            <FileTree />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
