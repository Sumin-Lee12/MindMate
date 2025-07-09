import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { Colors } from '../../../constants/colors';
import { DiaryStyleType } from '../types';

type StylePickerProps = {
  visible: boolean;
  onClose: () => void;
  style: DiaryStyleType;
  onStyleChange: (style: DiaryStyleType) => void;
};

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32];
const textAlignOptions: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
const backgroundColors = ['#FFFFFF', '#F5F7FF', '#FFE5BC', '#C9EFEF', '#FFD7DD'];

/**
 * 스타일 설정 모달 컴포넌트
 */
const StylePicker = ({ visible, onClose, style, onStyleChange }: StylePickerProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="max-h-[80%] rounded-t-3xl bg-white px-6 pb-8 pt-6"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="mb-4 text-center text-lg font-bold">스타일 설정</Text>

            {/* 글자 크기 */}
            <Text className="mb-2 text-sm font-bold">글자 크기</Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {fontSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => onStyleChange({ ...style, fontSize: size })}
                  className={`rounded-full px-4 py-2 ${
                    style.fontSize === size ? 'bg-paleCobalt' : 'bg-foggyBlue'
                  }`}
                >
                  <Text className={style.fontSize === size ? 'text-white' : 'text-black'}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 텍스트 정렬 */}
            <Text className="mb-2 text-sm font-bold">텍스트 정렬</Text>
            <View className="mb-4 flex-row gap-2">
              {textAlignOptions.map((align) => (
                <TouchableOpacity
                  key={align}
                  onPress={() => onStyleChange({ ...style, textAlign: align })}
                  className={`flex-1 rounded-lg py-3 ${
                    style.textAlign === align ? 'bg-paleCobalt' : 'bg-foggyBlue'
                  }`}
                >
                  <Text
                    className={`text-center ${
                      style.textAlign === align ? 'text-white' : 'text-black'
                    }`}
                  >
                    {align === 'left' ? '왼쪽' : align === 'center' ? '가운데' : '오른쪽'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 배경색 */}
            <Text className="mb-2 text-sm font-bold">배경색</Text>
            <View className="mb-6 flex-row flex-wrap gap-2">
              {backgroundColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => onStyleChange({ ...style, backgroundColor: color })}
                  className="h-12 w-12 rounded-lg border-2"
                  style={{
                    backgroundColor: color,
                    borderColor:
                      style.backgroundColor === color ? Colors.paleCobalt : 'transparent',
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default StylePicker;
