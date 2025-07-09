import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import type { MoodType, DiaryFormDataType } from '../types';
import { MOOD_OPTIONS, MOOD_COLORS } from '../types';

type MoodEmojiSelectorPropsType = {
  /** react-hook-form 컨트롤 */
  control: Control<DiaryFormDataType>;
  /** 에러 메시지 */
  error?: string;
};

/**
 * 이모티콘 기반 기분 선택 컴포넌트
 * 매끄러운 애니메이션과 함께 기분을 선택할 수 있는 UI 제공
 */
const MoodEmojiSelector = ({ control, error }: MoodEmojiSelectorPropsType) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  /**
   * 이모티콘 목록 확장/축소 애니메이션
   */
  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();

    setIsExpanded(!isExpanded);
  };

  /**
   * 선택된 기분에 해당하는 이모티콘 반환
   */
  const getSelectedEmoji = (mood?: MoodType) => {
    if (!mood) return '🙂';
    const selectedMood = MOOD_OPTIONS.find((option) => option.value === mood);
    return selectedMood?.emoji || '🙂';
  };

  /**
   * 선택된 기분에 해당하는 라벨 반환
   */
  const getSelectedLabel = (mood?: MoodType) => {
    if (!mood) return '오늘의 기분은 어떠셨나요?';
    const selectedMood = MOOD_OPTIONS.find((option) => option.value === mood);
    return selectedMood?.label || '오늘의 기분은 어떠셨나요?';
  };

  return (
    <Controller
      control={control}
      name="mood"
      render={({ field: { onChange, value } }) => (
        <View className="mb-4">
          <Text className="mb-2 text-base font-medium text-black">기분</Text>

          {/* 메인 선택 버튼 */}
          <TouchableOpacity
            onPress={toggleExpanded}
            className="border-gray-200 flex-row items-center justify-between rounded-lg border bg-white p-4"
          >
            <View className="flex-row items-center">
              <Text className="mr-3 text-2xl">{getSelectedEmoji(value)}</Text>
              <Text className={`text-base ${value ? 'font-medium text-black' : 'text-gray'}`}>
                {getSelectedLabel(value)}
              </Text>
            </View>

            {/* 확장/축소 표시 아이콘 */}
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    }),
                  },
                ],
              }}
            >
              <Text className="text-lg text-gray">▼</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* 이모티콘 옵션들 (애니메이션) */}
          <Animated.View
            style={{
              height: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 80],
              }),
              opacity: animatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0, 1],
              }),
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            }}
            className="overflow-hidden"
          >
            {isExpanded && (
              <View className="mt-2 flex-row justify-between rounded-lg bg-turquoise p-3">
                {MOOD_OPTIONS.map((moodOption, index) => {
                  const isSelected = value === moodOption.value;

                  return (
                    <Animated.View
                      key={moodOption.value}
                      style={{
                        opacity: animatedValue,
                        transform: [
                          {
                            translateY: animatedValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                            }),
                          },
                        ],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          onChange(moodOption.value);
                          setTimeout(() => {
                            toggleExpanded();
                          }, 150);
                        }}
                        className={`h-14 w-14 items-center justify-center rounded-full ${
                          isSelected ? 'bg-white shadow-lg' : 'bg-transparent'
                        }`}
                        style={{
                          borderWidth: isSelected ? 2 : 0,
                          borderColor: isSelected ? MOOD_COLORS[moodOption.value] : 'transparent',
                        }}
                      >
                        <Text className="text-2xl">{moodOption.emoji}</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            )}
          </Animated.View>

          {/* 선택된 기분 설명 */}
          {value && (
            <Animated.View
              style={{
                opacity: isExpanded ? 0 : 1,
              }}
              className="mt-2"
            >
              <Text className="text-center text-sm" style={{ color: MOOD_COLORS[value] }}>
                {MOOD_OPTIONS.find((option) => option.value === value)?.description}
              </Text>
            </Animated.View>
          )}

          {/* 기분 해제 버튼 */}
          {value && !isExpanded && (
            <TouchableOpacity
              onPress={() => onChange(undefined)}
              className="bg-gray-100 mt-2 self-center rounded-full px-4 py-2"
            >
              <Text className="text-sm text-gray">기분 해제</Text>
            </TouchableOpacity>
          )}

          {/* 에러 메시지 */}
          {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
        </View>
      )}
    />
  );
};

export default MoodEmojiSelector;
