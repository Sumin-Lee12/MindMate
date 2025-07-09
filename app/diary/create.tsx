import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Image as ImageIcon, Video, Mic, X } from 'lucide-react-native';
import { Colors } from '../../src/constants/colors'

/**
 * 일기 작성 페이지 컴포넌트
 */
const DiaryCreatePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const moods = [
    { emoji: '😊', label: '기쁨' },
    { emoji: '😢', label: '슬픔' },
    { emoji: '😡', label: '화남' },
    { emoji: '😨', label: '두려움' },
    { emoji: '😲', label: '놀람' },
    { emoji: '🤢', label: '역겨움' },
  ];

  /**
   * 뒤로가기 핸들러
   */
  const handleBack = () => {
    router.back();
  };

  /**
   * 등록하기 핸들러
   */
  const handleSubmit = () => {
    // TODO: 일기 저장 로직 구현
    console.log({ title, content, selectedMood, attachedImage });
    router.back();
  };

  /**
   * 취소 핸들러
   */
  const handleCancel = () => {
    router.back();
  };

  /**
   * 이미지 삭제 핸들러
   */
  const handleRemoveImage = () => {
    setAttachedImage(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-turquoise">
      <ScrollView className="flex-1">
        {/* 헤더 */}
        <View className="flex-row items-center justify-between px-4 py-4 mt-8 border-b-2 border-foggyBlue bg-white">
          <TouchableOpacity onPress={handleBack}>
            <ChevronLeft size={24} color={Colors.paleCobalt} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-paleCobalt">일기 작성하기</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="px-4 py-6">
          {/* 제목 입력 */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력해주세요."
            placeholderTextColor={Colors.gray}
            className="mb-4 h-16 rounded-lg border border-foggyBlue bg-white px-4 text-md"
          />

          {/* 내용 입력 */}
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="내용을 입력해 주세요."
            placeholderTextColor={Colors.gray}
            multiline
            textAlignVertical="top"
            className="mb-4 h-64 rounded-lg border border-foggyBlue bg-white p-4 text-md"
          />

          {/* 미디어 버튼들 */}
          <View className="mb-4 flex-row gap-3">
            <TouchableOpacity className="flex-row items-center rounded-full bg-white px-4 py-2 shadow-dropShadow">
              <ImageIcon size={20} color={Colors.paleCobalt} />
              <Text className="ml-2 text-sm text-paleCobalt">이미지</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center rounded-full bg-white px-4 py-2 shadow-dropShadow">
              <Video size={20} color={Colors.paleCobalt} />
              <Text className="ml-2 text-sm text-paleCobalt">동영상</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center rounded-full bg-white px-4 py-2 shadow-dropShadow">
              <Mic size={20} color={Colors.paleCobalt} />
              <Text className="ml-2 text-sm text-paleCobalt">음성</Text>
            </TouchableOpacity>
          </View>

          {/* 첨부된 이미지 미리보기 */}
          {attachedImage && (
            <View className="relative mb-4 h-20 w-20">
              <View className="h-full w-full rounded-lg bg-foggyBlue" />
              <TouchableOpacity
                onPress={handleRemoveImage}
                className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-gray"
              >
                <X size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}

          {/* 날짜 시간 표시 */}
          <View className="mb-4 flex-row items-center gap-2">
            <View className="h-8 w-8 rounded-full bg-gray" />
            <Text className="text-sm text-gray">2025. 6. 7. 토요일 오후 8: 05</Text>
          </View>

          {/* 오늘의 기분 */}
          <View className="mb-6 flex-row items-center gap-2">
            <View className="h-8 w-8 rounded-full bg-gray" />
            <Text className="text-sm text-gray">오늘의 기분</Text>
          </View>

          {/* 감정 선택 */}
          <View className="mb-8 flex-row flex-wrap gap-3">
            {moods.map((mood, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedMood(mood.label)}
                className={`flex-row items-center rounded-full px-4 py-2 ${
                  selectedMood === mood.label ? 'bg-paleCobalt' : 'bg-white'
                } shadow-dropShadow`}
              >
                <Text className="text-lg">{mood.emoji}</Text>
                <Text
                  className={`ml-2 text-sm ${
                    selectedMood === mood.label ? 'text-white' : 'text-paleCobalt'
                  }`}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View className="flex-row gap-4 border-t border-foggyBlue bg-white px-4 py-4 mb-12">
        <TouchableOpacity
          onPress={handleSubmit}
          className="flex-1 items-center justify-center rounded-lg bg-paleCobalt py-4"
        >
          <Text className="text-md font-bold text-white">등록하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancel}
          className="flex-1 items-center justify-center rounded-lg border border-paleCobalt bg-white py-4"
        >
          <Text className="text-md font-bold text-paleCobalt">취소</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DiaryCreatePage;