import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Clock } from 'lucide-react-native';
import { Colors } from '../../../src/constants/colors';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DiaryService } from '../../../src/features/diary/services';
import { DiaryFormDataType, diaryFormSchema, DiaryMediaType as FormMediaType } from '../../../src/features/diary/types';
import MediaButtons from '../../../src/features/diary/components/media-buttons';
import MediaPreview from '../../../src/features/diary/components/media-preview';
import MoodPicker from '../../../src/features/diary/components/mood-picker';
import StylePicker from '../../../src/features/diary/components/style-picker';
import { useAudioRecording } from '../../../src/features/diary/hooks/use-audio-recording';
import { useMediaPicker } from '../../../src/features/diary/hooks/use-media-picker';
import { formatDateTime } from '../../../src/lib/date-utils';

type DiaryDetailType = Awaited<ReturnType<typeof DiaryService.getDiaryById>>;
type DiaryMediaType = Awaited<ReturnType<typeof DiaryService.getMediaByDiaryId>>;

/**
 * 일기 수정 페이지 컴포넌트
 */
const DiaryEditPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [diary, setDiary] = useState<DiaryDetailType | null>(null);
  const [existingMedia, setExistingMedia] = useState<DiaryMediaType>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiaryFormDataType>({
    resolver: zodResolver(diaryFormSchema),
    defaultValues: {
      title: '',
      content: '',
      mood: undefined,
      media: [],
      style: {
        fontFamily: 'default',
        fontSize: 16,
        textAlign: 'left',
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
      },
    },
  });

  const watchedStyle = watch('style');
  const watchedMedia = watch('media');
  const watchedMood = watch('mood');

  const { recordingState, audioUri, handleAudioRecording } = useAudioRecording(
    watchedMedia,
    setValue,
  );

  const { handleImagePicker, handleVideoPicker } = useMediaPicker(watchedMedia, setValue);

  useEffect(() => {
    const updateTime = () => setCurrentDateTime(formatDateTime());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) fetchDiaryData(numericId);
    }
  }, [id]);

  const fetchDiaryData = async (diaryId: number) => {
    try {
      setIsLoading(true);
      const [diaryData, mediaData] = await Promise.all([
        DiaryService.getDiaryById(diaryId),
        DiaryService.getMediaByDiaryId(diaryId),
      ]);
      
      if (diaryData) {
        setDiary(diaryData);
        setExistingMedia(mediaData);
        
        // 폼 초기값 설정
        setValue('title', diaryData.title || '');
        setValue('content', diaryData.body || '');
        setValue('mood', diaryData.mood as any || undefined);
        setValue('style', {
          fontFamily: diaryData.font || 'default',
          fontSize: diaryData.font_size || 16,
          textAlign: (diaryData.text_align as 'left' | 'center' | 'right') || 'left',
          textColor: diaryData.text_color || '#000000',
          backgroundColor: diaryData.background_color || '#FFFFFF',
        });
        
        // 기존 미디어를 폼 미디어로 변환
        const formMedia: FormMediaType[] = mediaData.map(media => ({
          id: media.id.toString(),
          type: media.mediaType as 'image' | 'video' | 'audio',
          uri: media.filePath,
        }));
        setValue('media', formMedia);
      }
      
    } catch (error) {
      console.error('일기 불러오기 실패:', error);
      Alert.alert('오류', '일기를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 미디어 제거
   */
  const handleRemoveMedia = (id: string) => {
    setValue(
      'media',
      watchedMedia.filter((m) => m.id !== id),
    );
  };

  /**
   * 일기 수정
   */
  const onSubmit = async (data: DiaryFormDataType) => {
    try {
      if (!diary || !id || typeof id !== 'string') {
        Alert.alert('오류', '일기 정보를 찾을 수 없습니다.');
        return;
      }

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        Alert.alert('오류', '잘못된 일기 ID입니다.');
        return;
      }

      // 일기 정보 업데이트
      await DiaryService.updateDiary({
        id: numericId,
        title: data.title,
        body: data.content,
        font: data.style.fontFamily,
        fontSize: data.style.fontSize,
        textAlign: data.style.textAlign,
        textColor: data.style.textColor,
        backgroundColor: data.style.backgroundColor,
        mood: data.mood,
        audioUri: audioUri ?? undefined,
      });

      // 기존 미디어 삭제 후 새 미디어 추가
      // TODO: 기존 미디어와 새 미디어 비교해서 변경된 것만 처리하는 로직 추가 가능
      
      // 새 미디어 추가
      const newMediaFiles = data.media.filter(media => 
        !existingMedia.some(existing => existing.filePath === media.uri)
      );
      
      for (const media of newMediaFiles) {
        await DiaryService.addMedia({
          ownerType: 'diary' as const,
          mediaType: media.type,
          filePath: media.uri,
          ownerId: numericId,
        });
      }

      Alert.alert('성공', '일기가 수정되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('일기 수정 실패:', error);
      Alert.alert('오류', '일기 수정 중 오류가 발생했습니다.');
    }
  };

  const handleBack = () => router.back();
  const handleCancel = () => {
    Alert.alert('확인', '수정을 취소하시겠습니까?', [
      { text: '아니오', style: 'cancel' },
      { text: '예', onPress: () => router.back() },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.paleCobalt} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="mb-[100px] flex-1">
        {/* 헤더 */}
        <View className="mt-8 flex-row items-center justify-between border-b-2 border-turquoise bg-white px-4 py-4">
          <TouchableOpacity onPress={handleBack}>
            <ChevronLeft size={24} color={Colors.paleCobalt} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-paleCobalt">일기 수정하기</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 제목 + 내용 + 미디어 버튼 */}
        <View
          className="h-auto rounded-xl"
          style={{ backgroundColor: watchedStyle.backgroundColor || '#F5F7FF' }}
        >
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="제목을 입력해주세요."
                placeholderTextColor={Colors.black}
                className="mb-4 px-4 py-4 text-xl font-medium"
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.gray,
                  fontFamily:
                    watchedStyle.fontFamily === 'default' ? undefined : watchedStyle.fontFamily,
                  color: watchedStyle.textColor,
                  textAlign: watchedStyle.textAlign,
                }}
              />
            )}
          />
          {errors.title && <Text className="text-red px-4 text-sm">{errors.title.message}</Text>}

          <View className="w-full flex-row">
            <View className="flex-1 p-4 pr-4">
              <Controller
                control={control}
                name="content"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="내용을 입력해 주세요."
                    placeholderTextColor={Colors.black}
                    multiline
                    textAlignVertical="top"
                    className="min-h-[100px] text-md font-normal"
                    style={{
                      borderWidth: 0,
                      fontSize: watchedStyle.fontSize,
                      fontFamily:
                        watchedStyle.fontFamily === 'default' ? undefined : watchedStyle.fontFamily,
                      color: watchedStyle.textColor,
                      textAlign: watchedStyle.textAlign,
                    }}
                  />
                )}
              />
              {errors.content && <Text className="text-red text-sm">{errors.content.message}</Text>}
            </View>

            <MediaButtons
              onImagePress={handleImagePicker}
              onVideoPress={handleVideoPicker}
              onAudioPress={handleAudioRecording}
              onStylePress={() => setShowStylePicker(true)}
              recordingState={recordingState}
            />
          </View>

          <MediaPreview media={watchedMedia} onRemove={handleRemoveMedia} />
        </View>

        {/* 날짜 및 기분 */}
        <View className="bg-white px-4 py-4">
          <View className="mb-4 flex-row items-center gap-2">
            <Clock size={20} color={Colors.paleCobalt} />
            <Text className="text-sm text-black">{currentDateTime}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowMoodPicker(true)}
            className="flex-row items-center gap-2"
          >
            {watchedMood ? (
              <MoodPicker.MoodDisplay mood={watchedMood} />
            ) : (
              <MoodPicker.EmptyMoodDisplay />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View className="absolute bottom-10 left-0 right-0 bg-white px-4 pb-6 pt-4">
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="flex-1 items-center justify-center rounded-lg bg-paleCobalt py-4"
          >
            <Text className="text-md font-bold text-white">수정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 items-center justify-center rounded-lg bg-paleYellow py-4"
          >
            <Text className="text-md font-bold text-paleCobalt">취소</Text>
          </TouchableOpacity>
        </View>
      </View>

      <MoodPicker
        visible={showMoodPicker}
        onClose={() => setShowMoodPicker(false)}
        onSelect={(mood) => {
          setValue('mood', mood);
          setShowMoodPicker(false);
        }}
      />

      <StylePicker
        visible={showStylePicker}
        onClose={() => setShowStylePicker(false)}
        style={watchedStyle}
        onStyleChange={(newStyle) => setValue('style', newStyle)}
      />
    </SafeAreaView>
  );
};

export default DiaryEditPage;