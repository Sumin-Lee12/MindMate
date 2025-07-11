import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MoreVertical, Trash2, Edit3, Share2, Star } from 'lucide-react-native';
import { DiaryService } from '../../src/features/diary/services';
import { MediaSlider } from '../../src/features/diary/components/media-slider';
import ExportModal from '../../src/features/diary/components/export-modal';
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
  const [showExportModal, setShowExportModal] = useState(false);

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
    setShowExportModal(true);
  };

  const handleToggleFavorite = async () => {
    try {
      if (!id || typeof id !== 'string') return;

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) return;

      await DiaryService.toggleFavorite(numericId);

      // 일기 정보 다시 불러오기
      const updatedDiary = await DiaryService.getDiaryById(numericId);
      setDiary(updatedDiary);
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      Alert.alert('오류', '북마크 설정에 실패했습니다.');
    }
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

  // 수정된 일기인지 확인 (수정 시간이 생성 시간과 다른 경우)
  const isModified =
    diary.updated_at &&
    diary.created_at &&
    new Date(diary.updated_at).getTime() !== new Date(diary.created_at).getTime();

  // 표시할 시간 (수정 시간 우선, 없으면 생성 시간)
  const displayTime = diary.updated_at ?? diary.created_at ?? '';

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: diary.background_color || '#87CEEB' }}
    >
      <View className="mt-4 flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={handleBack}>
          <ChevronLeft size={24} color={Colors.paleCobalt} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-paleCobalt">나의 일기 상세보기</Text>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Star
              size={24}
              color={diary?.is_favorite ? '#FFD700' : Colors.paleCobalt}
              fill={diary?.is_favorite ? '#FFD700' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu((prev) => !prev)}>
            <MoreVertical size={24} color={Colors.paleCobalt} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 메뉴 드롭다운 */}
      {showMenu && (
        <View
          style={{
            position: 'absolute',
            top: 60,
            right: 16,
            backgroundColor: 'white',
            borderRadius: 12,
            paddingVertical: 8,
            minWidth: 120,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
            zIndex: 1000,
          }}
        >
          <TouchableOpacity
            onPress={handleEdit}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Edit3 size={16} color={Colors.paleCobalt} />
            <Text style={{ marginLeft: 8, fontSize: 14, color: Colors.paleCobalt }}>수정하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Share2 size={16} color={Colors.paleCobalt} />
            <Text style={{ marginLeft: 8, fontSize: 14, color: Colors.paleCobalt }}>내보내기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Trash2 size={16} color={Colors.red} />
            <Text style={{ marginLeft: 8, fontSize: 14, color: Colors.red }}>삭제하기</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 메뉴 외부 클릭 감지 */}
      {showMenu && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onPress={() => setShowMenu(false)}
        />
      )}

      <ScrollView className="flex-1">
        {/* 제목 및 날짜 */}
        <View
          className="mx-4 mt-4 gap-4 rounded-xl p-4"
          style={{ backgroundColor: diary.background_color || '#87CEEB' }}
        >
          <View className="flex-row items-center">
            <Text className="text-sm text-gray">
              {displayTime ? formatDateTimeString(displayTime) : ''}
            </Text>
            {isModified && <Text className="text-gray-500 ml-2 text-xs">(수정됨)</Text>}
          </View>
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
        <View
          className="mx-4 mt-4 rounded-xl p-4"
          style={{ backgroundColor: diary.background_color || '#87CEEB' }}
        >
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
        <View
          className="absolute bottom-16 left-0 right-0 flex-row items-center px-4 py-4"
          style={{ backgroundColor: diary.background_color || '#87CEEB' }}
        >
          <Text className="mr-2 text-2xl">{mood.emoji}</Text>
          <Text className="text-sm text-gray">오늘의 기분: {mood.label}</Text>
        </View>
      )}

      {/* 내보내기 모달 */}
      {diary && (
        <ExportModal
          visible={showExportModal}
          onClose={() => setShowExportModal(false)}
          diary={diary}
          media={media}
        />
      )}
    </SafeAreaView>
  );
};

export default DiaryDetailPage;
