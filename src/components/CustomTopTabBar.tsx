import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';

export default function CustomTopTabBar({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) {
  return (
    <View className="bg-blue-50 pt-safe">
      {/* MIND MATE 타이틀 */}
      <View className="items-center py-3 sm:py-4">
        <Text className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
          MIND MATE
        </Text>
      </View>

      <View className="flex-row px-2 sm:px-3 py-2 border-t border-b border-blue-600 items-center justify-center bg-blue-50">
      
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              className={`flex-1 mx-1 sm:mx-2 py-2 sm:py-3 px-2 sm:px-3 rounded-lg items-center justify-center ${
                isFocused ? 'bg-blue-600' : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-xs sm:text-sm ${
                  isFocused 
                    ? 'font-bold text-white' 
                    : 'font-normal text-blue-600'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
