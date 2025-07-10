import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';

export default function CustomTopTabBar({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) {
  return (
    <View
      style={{
        backgroundColor: '#f0f3ff',
        paddingTop: 20,
      }}
    >
      {/* MIND MATE 타이틀 */}
      <View
        style={{
          alignItems: 'center',
          paddingVertical: 12,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#5b67ca',
          }}
        >
          MIND MATE
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderTopColor: '##576BCD',
          borderBottomColor: '##576BCD',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f3ff',
        }}
      >
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
              style={{
                flex: 1,
                marginHorizontal: 4,
                paddingVertical: 12,
                paddingHorizontal: 12,
                backgroundColor: isFocused ? '#5b67ca' : 'transparent',
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: isFocused ? 'bold' : 'normal',
                  color: isFocused ? '#ffffff' : '#576BCD',
                }}
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
