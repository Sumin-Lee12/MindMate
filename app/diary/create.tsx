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
import { ChevronLeft, Smile, Clock, Image as ImageIcon, Video, Mic, X } from 'lucide-react-native';
import { Colors } from '../../src/constants/colors';

const DiaryCreatePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const handleBack = () => router.back();
  const handleSubmit = () => {
    console.log({ title, content, selectedMood, attachedImage });
    router.back();
  };
  const handleCancel = () => router.back();
  const handleRemoveImage = () => setAttachedImage(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 콘텐츠 스크롤 영역 */}
      <ScrollView className="mb-[100px] flex-1">
        {' '}
        {/* 버튼 높이만큼 하단 여백 확보 */}
        {/* 헤더 */}
        <View className="mt-8 flex-row items-center justify-between border-b-2 border-turquoise bg-white px-4 py-4">
          <TouchableOpacity onPress={handleBack}>
            <ChevronLeft size={24} color={Colors.paleCobalt} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-paleCobalt">일기 작성하기</Text>
          <View style={{ width: 24 }} />
        </View>
        {/* 제목 + 예약 메시지 + 미디어 + 이미지 미리보기 */}
        <View className="h-3/4 rounded-xl bg-[#F5F7FF]">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력해주세요."
            placeholderTextColor={Colors.black}
            className="mb-4 mt-4 p-4 py-4 text-xl font-medium text-black"
            style={{
              borderBottomWidth: 1, // 하단만 보더 두께 설정
              borderBottomColor: Colors.gray, // 하단 보더 색상 설정
            }}
            underlineColorAndroid="transparent"
          />
          <View className="w-full flex-row">
            <View className="flex-1 p-4 pr-4">
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="예약 메시지를 입력해 주세요."
                placeholderTextColor={Colors.black}
                multiline
                textAlignVertical="top"
                className="min-h-[100px] text-md text-black"
                style={{ borderWidth: 0 }}
              />
            </View>
            <View className="mt-4 items-center justify-between gap-6 p-4">
              <TouchableOpacity className="h-16 w-16 items-center justify-center rounded-full border border-paleCobalt">
                <ImageIcon size={32} color={Colors.paleCobalt} />
              </TouchableOpacity>
              <TouchableOpacity className="h-16 w-16 items-center justify-center rounded-full border border-paleCobalt">
                <Video size={32} color={Colors.paleCobalt} />
              </TouchableOpacity>
              <TouchableOpacity className="h-16 w-16 items-center justify-center rounded-full border border-paleCobalt">
                <Mic size={32} color={Colors.paleCobalt} />
              </TouchableOpacity>
              <TouchableOpacity className="h-16 w-16 items-center justify-center rounded-full border border-paleCobalt">
                <Text className="text-lg font-bold text-paleCobalt">Aa</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 이미지 미리보기 */}
          {attachedImage && (
            <View className="relative mt-4 h-20 w-20">
              <Image
                source={{ uri: attachedImage }}
                className="h-full w-full rounded-lg"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={handleRemoveImage}
                className="absolute -right-2 -top-2 h-6 w-6 items-center justify-center rounded-full bg-gray"
              >
                <X size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* 날짜 및 기분 */}
        <View className="bg-white px-4 py-4">
          <View className="mb-4 flex-row items-center gap-2">
            <Clock size={20} color={Colors.paleCobalt} />
            <Text className="text-sm text-black">2025. 6. 7. 토요일 오후 8: 05</Text>
          </View>
          <View className="mb-2 flex-row items-center gap-2">
            <Smile size={20} color={Colors.paleCobalt} />
            <Text className="text-sm text-black">오늘의 기분</Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 영역 */}
      <View className="absolute bottom-10 left-0 right-0 bg-white px-4 pb-6 pt-4">
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 items-center justify-center rounded-lg bg-paleCobalt py-4"
          >
            <Text className="text-md font-bold text-white">등록하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 items-center justify-center rounded-lg bg-paleYellow py-4"
          >
            <Text className="text-md font-bold text-paleCobalt">취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DiaryCreatePage;
