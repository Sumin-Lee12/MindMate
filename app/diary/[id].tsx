import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MoreVertical, Trash2, Edit3, Share2 } from 'lucide-react-native';
import { DiaryService } from '../../src/features/diary/services';
import { MediaSlider } from '../../src/features/diary/components/media-slider';
import { formatDateTimeString } from '../../src/lib/date-utils';
import { MOOD_OPTIONS } from '../../src/features/diary/types';
import { Colors } from '../../src/constants/colors';

type DiaryDetailType = Awaited<ReturnType<typeof DiaryService.getDiaryById>>;
type DiaryMediaType = Awaited<ReturnType<typeof DiaryService.getMediaByDiaryId>>;

const DiaryDetailPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [diary, setDiary] = useState<DiaryDetailType | null>(null);
  const [media, setMedia] = useState<DiaryMediaType>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) fetchDiaryDetail(numericId);
    }
  }, [id]);

  const fetchDiaryDetail = async (diaryId: number) => {
    try {
      setIsLoading(true);
      const [diaryData, mediaData] = await Promise.all([
        DiaryService.getDiaryById(diaryId),
        DiaryService.getMediaByDiaryId(diaryId),
      ]);
      setDiary(diaryData);
      setMedia(mediaData);
    } catch (error) {
      console.error('일기 불러오기 실패:', error);
      Alert.alert('오류', '일기를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    Alert.alert('일기 삭제', '이 일기를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            if (id && typeof id === 'string') {
              const numericId = parseInt(id, 10);
              if (!isNaN(numericId)) {
                await DiaryService.deleteDiary(numericId);
                Alert.alert('성공', '일기가 삭제되었습니다.', [
                  { text: '확인', onPress: () => router.back() },
                ]);
              }
            }
          } catch (error) {
            console.error('일기 삭제 실패:', error);
            Alert.alert('오류', '일기 삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    setShowMenu(false);
    router.push(`/diary/edit/${id}`);
  };

  const handleShare = () => {
    setShowMenu(false);
    // TODO: PDF 변환 후 공유 로직
    // 1) PDF 생성
    // 2) Share API로 PDF 및 카카오톡 공유 호출
    Alert.alert('준비중', '공유 기능은 준비중입니다.');
  };

  const handleBack = () => router.back();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.paleCobalt} />
      </SafeAreaView>
    );
  }

  if (!diary) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray">일기를 찾을 수 없습니다.</Text>
        <TouchableOpacity onPress={handleBack} className="mt-4">
          <Text className="text-paleCobalt">돌아가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const mood = diary.mood ? MOOD_OPTIONS.find((m) => m.value === diary.mood) : null;

  return (
    <SafeAreaView className="flex-1 bg-turquoise">
      <View className="mt-4 flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={handleBack}>
          <ChevronLeft size={24} color={Colors.paleCobalt} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-paleCobalt">나의 일기 상세보기</Text>
        <TouchableOpacity onPress={() => setShowMenu((prev) => !prev)}>
          <MoreVertical size={24} color={Colors.paleCobalt} />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <View className="absolute right-4 top-16 z-10 rounded bg-white shadow-lg">
          <TouchableOpacity onPress={handleEdit} className="border-b px-4 py-2">
            <Text>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} className="border-b px-4 py-2">
            <Text>공유</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="px-4 py-2">
            <Text style={{ color: Colors.red }}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="flex-1">
        {/* 제목 및 날짜 */}
        <View className="mx-4 mt-4 gap-4 rounded-xl bg-turquoise p-4">
          <Text className="text-sm text-gray">
            {diary.created_at ? formatDateTimeString(diary.created_at) : ''}
          </Text>
          <Text
            className="mb-2 text-2xl font-bold"
            style={{
              color: diary.text_color || '#000000',
              textAlign: (diary.text_align as any) || 'left',
              fontFamily: diary.font === 'default' ? undefined : (diary.font ?? undefined),
            }}
          >
            {diary.title}
          </Text>
        </View>

        {/* 미디어 슬라이더 */}
        {media.length > 0 && (
          <View className="mt-4">
            <MediaSlider media={media} />
          </View>
        )}

        {/* 내용 */}
        <View className="mx-4 mt-10 rounded-xl bg-turquoise p-4">
          <Text
            className="leading-6"
            style={{
              fontSize: diary.font_size || 16,
              color: diary.text_color || '#000000',
              textAlign: (diary.text_align as any) || 'left',
              fontFamily: diary.font === 'default' ? undefined : (diary.font ?? undefined),
            }}
          >
            {diary.body}
          </Text>
        </View>
      </ScrollView>

      {/* 하단 감정 표시 */}
      {mood && (
        <View className="absolute bottom-16 left-0 right-0 flex-row items-center bg-turquoise px-4 py-4">
          <Text className="mr-2 text-2xl">{mood.emoji}</Text>
          <Text className="text-sm text-gray">오늘의 기분: {mood.label}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DiaryDetailPage;
