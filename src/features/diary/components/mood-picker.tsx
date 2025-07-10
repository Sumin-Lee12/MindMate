import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StatusBar } from 'react-native';
import { Smile } from 'lucide-react-native';
import { Colors } from '../../../constants/colors';
import { MoodType, MOOD_OPTIONS } from '../types';

type MoodPickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (mood: MoodType) => void;
};

/**
 * 기분 선택 모달 컴포넌트
 */
const MoodPicker = ({ visible, onClose, onSelect }: MoodPickerProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
          paddingTop: StatusBar.currentHeight || 0,
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 24,
            paddingTop: 24,
            position: 'absolute',
            height: '40%',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <Text className="mb-4 text-center text-lg font-bold">오늘의 기분을 선택하세요</Text>
          <View className="flex-row flex-wrap justify-around">
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                onPress={() => onSelect(mood.value)}
                className="mb-6 items-center"
                style={{ width: '30%' }}
              >
                <Text className="text-4xl">{mood.emoji}</Text>
                <Text className="mt-2 text-base">{mood.label}</Text>
                <Text className="text-ellipsis text-center text-xs text-gray">
                  {mood.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/**
 * 선택된 기분 표시 컴포넌트
 */
const MoodDisplay = ({ mood }: { mood: MoodType }) => {
  const selectedMood = MOOD_OPTIONS.find((m) => m.value === mood);
  return (
    <>
      <Text className="text-xl">{selectedMood?.emoji}</Text>
      <Text className="text-sm text-black">{selectedMood?.label}</Text>
    </>
  );
};

/**
 * 기분 미선택시 표시 컴포넌트
 */
const EmptyMoodDisplay = () => {
  return (
    <>
      <Smile size={20} color={Colors.paleCobalt} />
      <Text className="text-sm text-black">오늘의 기분</Text>
    </>
  );
};

MoodPicker.MoodDisplay = MoodDisplay;
MoodPicker.EmptyMoodDisplay = EmptyMoodDisplay;

export default MoodPicker;
