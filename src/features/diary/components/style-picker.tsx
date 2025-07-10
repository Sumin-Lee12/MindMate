import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
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
        <View
          onStartShouldSetResponder={() => true}
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 0,
            height: '52%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}
            >
              스타일 설정
            </Text>

            {/* 글자 크기 */}
            <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>글자 크기</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {fontSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => onStyleChange({ ...style, fontSize: size })}
                  style={{
                    backgroundColor: style.fontSize === size ? Colors.paleCobalt : Colors.foggyBlue,
                    borderRadius: 100,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      color: style.fontSize === size ? 'white' : 'black',
                    }}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 텍스트 정렬 */}
            <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>텍스트 정렬</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {textAlignOptions.map((align) => (
                <TouchableOpacity
                  key={align}
                  onPress={() => onStyleChange({ ...style, textAlign: align })}
                  style={{
                    flex: 1,
                    backgroundColor:
                      style.textAlign === align ? Colors.paleCobalt : Colors.foggyBlue,
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: style.textAlign === align ? 'white' : 'black',
                    }}
                  >
                    {align === 'left' ? '왼쪽' : align === 'center' ? '가운데' : '오른쪽'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 배경색 */}
            <Text style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>배경색</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {backgroundColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => onStyleChange({ ...style, backgroundColor: color })}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    backgroundColor: color,
                    borderWidth: 2,
                    borderColor:
                      style.backgroundColor === color ? Colors.paleCobalt : 'transparent',
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default StylePicker;
