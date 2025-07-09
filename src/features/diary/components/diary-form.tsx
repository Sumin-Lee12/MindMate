import React, { useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { DiaryFormDataType, DiaryItemType } from '../types';
import { diaryFormSchema } from '../types';
import MoodEmojiSelector from './mood-emoji-selector';
import DiaryMediaList from './diary-media-list';
import DiaryMediaToolbar from './diary-media-toolbar';
import FontSettingsModal from './font-settings-modal';

type DiaryFormPropsType = {
  /** 편집할 일기 데이터 (편집 모드일 때) */
  initialData?: DiaryItemType;
  /** 폼 제출 시 콜백 */
  onSubmit: (data: DiaryFormDataType) => Promise<void>;
  /** 로딩 상태 */
  isLoading?: boolean;
  /** 편집 모드 여부 */
  isEditMode?: boolean;
};

/**
 * 일기 작성/편집 폼 컴포넌트
 * React Hook Form + Zod를 사용한 폼 검증 및 상태 관리
 */
const DiaryForm = ({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  isEditMode = false 
}: DiaryFormPropsType) => {
  
  /**
   * React Hook Form 설정
   */
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<DiaryFormDataType>({
    resolver: zodResolver(diaryFormSchema),
    defaultValues: {
      title: '',
      content: '',
      media: [],
      style: {
        fontFamily: 'pretendard',
        fontSize: 16,
        textAlign: 'left',
        textColor: '#000000',
        backgroundColor: '#ffffff',
      },
      mood: undefined,
    },
    mode: 'onChange',
  });

  // 현재 폼 데이터 감시
  const watchedStyle = watch('style');
  const watchedMedia = watch('media');

  /**
   * 편집 모드일 때 초기 데이터 설정
   */
  useEffect(() => {
    if (initialData && isEditMode) {
      reset({
        title: initialData.title,
        content: initialData.content,
        media: initialData.media,
        style: initialData.style,
        mood: initialData.mood,
      });
    }
  }, [initialData, isEditMode, reset]);

  /**
   * 폼 제출 핸들러
   */
  const handleFormSubmit = async (data: DiaryFormDataType) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('일기 저장 실패:', error);
      Alert.alert('오류', '일기를 저장하는 중 문제가 발생했습니다.');
    }
  };

  /**
   * 미디어 추가 핸들러
   */
  const handleAddMedia = (newMedia: any) => {
    const currentMedia = watchedMedia || [];
    setValue('media', [...currentMedia, newMedia], { shouldValidate: true, shouldDirty: true });
  };

  /**
   * 미디어 제거 핸들러
   */
  const handleRemoveMedia = (mediaId: string) => {
    const currentMedia = watchedMedia || [];
    const updatedMedia = currentMedia.filter(media => media.id !== mediaId);
    setValue('media', updatedMedia, { shouldValidate: true, shouldDirty: true });
  };

  /**
   * 폰트 스타일 업데이트 핸들러
   */
  const handleUpdateStyle = (newStyle: Partial<typeof watchedStyle>) => {
    setValue('style', { ...watchedStyle, ...newStyle }, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="p-4">
          {/* 제목 입력 */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-black">제목</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="제목을 입력하세요"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  className={`rounded-lg border p-3 text-xl font-bold ${
                    errors.title ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholderTextColor="#999"
                  multiline
                />
              )}
            />
            {errors.title && (
              <Text className="mt-1 text-sm text-red-500">{errors.title.message}</Text>
            )}
          </View>

          {/* 기분 선택 */}
          <MoodEmojiSelector 
            control={control}
            error={errors.mood?.message}
          />

          {/* 첨부된 미디어 표시 */}
          {watchedMedia && watchedMedia.length > 0 && (
            <DiaryMediaList 
              media={watchedMedia}
              editable={true}
              onRemoveMedia={handleRemoveMedia}
            />
          )}

          {/* 내용 입력 */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-black">내용</Text>
            <Controller
              control={control}
              name="content"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="오늘 하루는 어땠나요?"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  textAlignVertical="top"
                  style={{
                    fontFamily: watchedStyle.fontFamily,
                    fontSize: watchedStyle.fontSize,
                    textAlign: watchedStyle.textAlign,
                    color: watchedStyle.textColor,
                    minHeight: 200,
                    lineHeight: watchedStyle.fontSize * 1.4,
                  }}
                  className={`rounded-lg border p-3 ${
                    errors.content ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.content && (
              <Text className="mt-1 text-sm text-red-500">{errors.content.message}</Text>
            )}
          </View>

          {/* 폼 상태 표시 */}
          <View className="mb-4 rounded-lg bg-gray-50 p-3">
            <Text className="mb-1 text-xs text-gray">폼 상태</Text>
            <View className="flex-row flex-wrap gap-2">
              <Text className={`text-xs ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                검증: {isValid ? '통과' : '실패'}
              </Text>
              <Text className={`text-xs ${isDirty ? 'text-blue-600' : 'text-gray'}`}>
                변경: {isDirty ? '있음' : '없음'}
              </Text>
              <Text className="text-xs text-gray">
                미디어: {watchedMedia?.length || 0}개
              </Text>
            </View>
          </View>

          {/* 여백 (키보드용) */}
          <View className="h-20" />
        </View>
      </ScrollView>

      {/* 미디어 툴바 */}
      <DiaryMediaToolbar 
        onAddMedia={handleAddMedia}
        onUpdateStyle={handleUpdateStyle}
        currentStyle={watchedStyle}
        onSubmit={handleSubmit(handleFormSubmit)}
        isLoading={isLoading}
        isValid={isValid}
        isEditMode={isEditMode}
      />

      {/* 폰트 설정 모달 */}
      <FontSettingsModal 
        currentStyle={watchedStyle}
        onUpdateStyle={handleUpdateStyle}
      />
    </View>
  );
};

export default DiaryForm;