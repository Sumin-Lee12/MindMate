import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Smile, Clock, Image as ImageIcon, Video, Mic, X } from 'lucide-react-native';
import { Colors } from '../../src/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { DiaryService } from '../../src/features/diary/services';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MoodType,
  DiaryFormDataType,
  diaryFormSchema,
  MOOD_OPTIONS,
  DiaryMediaType,
  RecordingStateType,
} from '../../src/features/diary/types';

/**
 * 일기 작성 페이지 컴포넌트
 */
const DiaryCreatePage = () => {
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingStateType>({
    isRecording: false,
    duration: 0,
  });
  const [audioUri, setAudioUri] = useState<string | null>(null);

  // react-hook-form 설정
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

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32];
  const textAlignOptions: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];

  /**
   * 현재 날짜 시간 포맷
   */
  const formatDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours || 12;

    return `${year}. ${month}. ${day}. ${weekday}요일 ${period} ${displayHours}: ${minutes}`;
  };

  useEffect(() => {
    // 1초마다 시간 업데이트
    const updateTime = () => setCurrentDateTime(formatDateTime());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * 이미지 선택/촬영
   */
  const handleImagePicker = async () => {
    const options = ['카메라로 촬영', '갤러리에서 선택', '취소'];
    Alert.alert('이미지 추가', '이미지를 추가할 방법을 선택하세요.', [
      {
        text: options[0],
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
          });
          if (!result.canceled) {
            const newMedia: DiaryMediaType = {
              id: Date.now().toString(),
              type: 'image',
              uri: result.assets[0].uri,
            };
            setValue('media', [...watchedMedia, newMedia]);
          }
        },
      },
      {
        text: options[1],
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
          });
          if (!result.canceled) {
            const newMedia: DiaryMediaType = {
              id: Date.now().toString(),
              type: 'image',
              uri: result.assets[0].uri,
            };
            setValue('media', [...watchedMedia, newMedia]);
          }
        },
      },
      { text: options[2], style: 'cancel' },
    ]);
  };

  /**
   * 동영상 선택/촬영
   */
  const handleVideoPicker = async () => {
    const options = ['카메라로 촬영', '갤러리에서 선택', '취소'];
    Alert.alert('동영상 추가', '동영상을 추가할 방법을 선택하세요.', [
      {
        text: options[0],
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
          });
          if (!result.canceled) {
            const newMedia: DiaryMediaType = {
              id: Date.now().toString(),
              type: 'video',
              uri: result.assets[0].uri,
              duration: result.assets[0].duration ?? undefined,
            };
            setValue('media', [...watchedMedia, newMedia]);
          }
        },
      },
      {
        text: options[1],
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
          });
          if (!result.canceled) {
            const newMedia: DiaryMediaType = {
              id: Date.now().toString(),
              type: 'video',
              uri: result.assets[0].uri,
              duration: result.assets[0].duration ?? undefined,
            };
            setValue('media', [...watchedMedia, newMedia]);
          }
        },
      },
      { text: options[2], style: 'cancel' },
    ]);
  };

  /**
   * 음성 녹음 시작/중지
   */
  const handleAudioRecording = async () => {
    try {
      if (recordingState.isRecording) {
        // 녹음 중지
        if (recordingState.recording) {
          await recordingState.recording.stopAndUnloadAsync();
          const uri = recordingState.recording.getURI();
          if (uri) {
            setAudioUri(uri);
            const newMedia: DiaryMediaType = {
              id: Date.now().toString(),
              type: 'audio',
              uri: uri,
              duration: recordingState.duration,
            };
            setValue('media', [...watchedMedia, newMedia]);
            Alert.alert('녹음 완료', '음성이 저장되었습니다.');
          }
        }
        setRecordingState({ isRecording: false, duration: 0 });
      } else {
        // 녹음 시작
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('권한 필요', '음성 녹음을 위해 마이크 권한이 필요합니다.');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
        );

        setRecordingState({
          isRecording: true,
          startTime: new Date(),
          duration: 0,
          recording,
        });

        // 녹음 시간 업데이트
        const interval = setInterval(() => {
          setRecordingState((prev) => ({
            ...prev,
            duration: prev.startTime
              ? Math.floor((new Date().getTime() - prev.startTime.getTime()) / 1000)
              : 0,
          }));
        }, 1000);

        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('음성 녹음 실패:', error);
      Alert.alert('오류', '음성 녹음 중 오류가 발생했습니다.');
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
   * 일기 저장
   */
  const onSubmit = async (data: DiaryFormDataType) => {
    try {
      // 미디어 파일 처리
      const mediaFiles = data.media.map((media) => ({
        ownerType: 'diary' as const,
        mediaType: media.type,
        filePath: media.uri,
      }));

      // 일기 생성
      const diaryId = await DiaryService.createDiary({
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

      // 미디어 파일 저장
      for (const media of mediaFiles) {
        await DiaryService.addMedia({
          ...media,
          ownerId: diaryId,
        });
      }

      Alert.alert('성공', '일기가 저장되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('일기 저장 실패:', error);
      Alert.alert('오류', '일기 저장 중 오류가 발생했습니다.');
    }
  };

  const handleBack = () => router.back();
  const handleCancel = () => {
    Alert.alert('확인', '작성을 취소하시겠습니까?', [
      { text: '아니오', style: 'cancel' },
      { text: '예', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="mb-[100px] flex-1">
        {/* 헤더 */}
        <View className="mt-8 flex-row items-center justify-between border-b-2 border-turquoise bg-white px-4 py-4">
          <TouchableOpacity onPress={handleBack}>
            <ChevronLeft size={24} color={Colors.paleCobalt} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-paleCobalt">일기 작성하기</Text>
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

            {/* 미디어 버튼들 */}
            <View className="mt-4 items-center justify-between gap-6 p-4">
              <TouchableOpacity
                onPress={handleImagePicker}
                className="h-16 w-16 items-center justify-center rounded-full border border-paleCobalt"
              >
                <ImageIcon size={32} color={Colors.paleCobalt} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleVideoPicker}
                className="h-16 w-16 items-center justify-center rounded-full border border-paleCobalt"
              >
                <Video size={32} color={Colors.paleCobalt} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAudioRecording}
                className="h-16 w-16 items-center justify-center rounded-full border border-paleCobalt"
              >
                <Mic size={32} color={Colors.paleCobalt} />
                {recordingState.isRecording && (
                  <View className="absolute -bottom-6 items-center">
                    <View className="bg-red rounded-full px-2 py-1">
                      <Text className="text-xs text-white">{recordingState.duration}초</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowStylePicker(true)}
                className="h-16 w-16 items-center justify-center rounded-full border border-paleCobalt"
              >
                <Text className="text-lg font-bold text-paleCobalt">Aa</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 첨부된 미디어 미리보기 */}
          {watchedMedia.length > 0 && (
            <ScrollView horizontal className="px-4 pb-4">
              {watchedMedia.map((media) => (
                <View key={media.id} className="relative mr-2 h-20 w-20">
                  {media.type === 'image' ? (
                    <Image
                      source={{ uri: media.uri }}
                      className="h-full w-full rounded-lg"
                      resizeMode="cover"
                    />
                  ) : media.type === 'video' ? (
                    <View className="h-full w-full items-center justify-center rounded-lg bg-gray">
                      <Video size={32} color={Colors.white} />
                    </View>
                  ) : (
                    <View className="h-full w-full items-center justify-center rounded-lg bg-gray">
                      <Mic size={32} color={Colors.white} />
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => handleRemoveMedia(media.id)}
                    className="bg-red absolute -right-0 -top-0 h-6 w-6 items-center justify-center rounded-full"
                  >
                    <X size={12} color={Colors.black} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
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
              <Text className="text-xl">
                {MOOD_OPTIONS.find((m) => m.value === watchedMood)?.emoji}
              </Text>
            ) : (
              <Smile size={20} color={Colors.paleCobalt} />
            )}
            <Text className="text-sm text-black">
              {watchedMood
                ? MOOD_OPTIONS.find((m) => m.value === watchedMood)?.label
                : '오늘의 기분'}
            </Text>
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

      {/* 기분 선택 모달 */}
      <Modal
        visible={showMoodPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoodPicker(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowMoodPicker(false)}
          />
          <View className="rounded-t-3xl bg-white px-6 pt-6">
            <Text className="mb-4 text-center text-lg font-bold">오늘의 기분을 선택하세요</Text>
            <View className="flex-row flex-wrap justify-around pb-6">
              {MOOD_OPTIONS.map((mood) => (
                <TouchableOpacity
                  key={mood.value}
                  onPress={() => {
                    setValue('mood', mood.value);
                    setShowMoodPicker(false);
                  }}
                  className="mb-4 items-center"
                >
                  <Text className="text-4xl">{mood.emoji}</Text>
                  <Text className="mt-2 text-sm">{mood.label}</Text>
                  <Text className="text-xs text-gray">{mood.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* 스타일 설정 모달 */}
      <Modal
        visible={showStylePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStylePicker(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setShowStylePicker(false)}
        >
          <View className="max-h-[80%] rounded-t-3xl bg-white px-6 pt-6">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="mb-4 text-center text-lg font-bold">스타일 설정</Text>

              {/* 글자 크기 */}
              <Text className="mb-2 text-sm font-bold">글자 크기</Text>
              <View className="mb-4 flex-row flex-wrap gap-2">
                {fontSizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setValue('style', { ...watchedStyle, fontSize: size })}
                    className={`rounded-full px-4 py-2 ${
                      watchedStyle.fontSize === size ? 'bg-paleCobalt' : 'bg-foggyBlue'
                    }`}
                  >
                    <Text className={watchedStyle.fontSize === size ? 'text-white' : 'text-black'}>
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
                    onPress={() => setValue('style', { ...watchedStyle, textAlign: align })}
                    className={`flex-1 rounded-lg py-3 ${
                      watchedStyle.textAlign === align ? 'bg-paleCobalt' : 'bg-foggyBlue'
                    }`}
                  >
                    <Text
                      className={`text-center ${
                        watchedStyle.textAlign === align ? 'text-white' : 'text-black'
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
                {['#FFFFFF', '#F5F7FF', '#FFE5BC', '#C9EFEF', '#FFD7DD'].map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setValue('style', { ...watchedStyle, backgroundColor: color })}
                    className="h-12 w-12 rounded-lg border-2"
                    style={{
                      backgroundColor: color,
                      borderColor:
                        watchedStyle.backgroundColor === color ? Colors.paleCobalt : 'transparent',
                    }}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default DiaryCreatePage;
