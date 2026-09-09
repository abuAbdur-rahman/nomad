import { View, TouchableOpacity, Text, ScrollView } from 'react-native'
import { useRef, useImperativeHandle, forwardRef } from 'react'
import { useSettingsStore } from '@/stores/settings.store'
import { keybindings } from '@/constants/keybindings'

interface ExtraKeyToolbarProps {
  onKeyPress: (key: string, code: string) => void
}

export interface ExtraKeyToolbarRef {
  focus: () => void
}

export const ExtraKeyToolbar = forwardRef<ExtraKeyToolbarRef, ExtraKeyToolbarProps>(
  ({ onKeyPress }, ref) => {
    const { extraToolbar, toolbarRow2 } = useSettingsStore()
    const scrollViewRef = useRef<ScrollView>(null)

    useImperativeHandle(ref, () => ({
      focus: () => {
        scrollViewRef.current?.focus()
      },
    }))

    if (!extraToolbar) {
      return null
    }

    const handleKeyPress = (key: string, code: string) => {
      onKeyPress(key, code)
    }

    return (
      <View className="bg-dark-200 border-t border-dark-100 py-1.5">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle="px-2 gap-1.5"
        >
          {keybindings.row1.map((key, index) => (
            <TouchableOpacity
              key={`row1-${index}`}
              className="bg-dark-400 px-3.5 py-2.5 rounded-md min-w-[40px] items-center justify-center"
              onPress={() => handleKeyPress(key.key, key.code)}
              activeOpacity={0.6}
            >
              <Text className="text-white text-base font-medium">{key.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {toolbarRow2 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle="px-2 gap-1.5 mt-1.5"
          >
            {keybindings.row2.map((key, index) => (
              <TouchableOpacity
                key={`row2-${index}`}
                className="bg-dark-400 px-3.5 py-2.5 rounded-md min-w-[40px] items-center justify-center"
                onPress={() => handleKeyPress(key.key, key.code)}
                activeOpacity={0.6}
              >
                <Text className="text-white text-base font-medium">{key.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    )
  }
)

ExtraKeyToolbar.displayName = 'ExtraKeyToolbar'
