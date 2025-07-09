import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { 
  Camera, 
  Image as ImageIcon, 
  Video, 
  Mic, 
  MicOff, 
  Type, 
  Save,
  Palette,
} from 'lucide-react-native';
import type { DiaryStyleType, DiaryMediaType } from '../types';
import { MediaService } from '../services/media-service';

type DiaryMediaToolbarPropsType = {
  /** 미디어 추가 콜백 */
  onAddMedia: (media: DiaryMediaType) => void;
  /** 스타일 업데이트 콜백 */
  onUpdateStyle: (style: Partial<DiaryStyleType>) => void;
  /** 현재 스타일 */
  currentStyle: DiaryStyleType;
  /** 폼 제출 콜백 */
  onSubmit: () => void;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 폼 유효성 */
  isValid: boolean;
  /** 편집 모드 여부 */
  isEditMode: boolean;
};

/**
 * 일기 작성 시 미디어 추가 툴바 컴포넌트
 * React Hook Form과 연동하여 미디어 및 스타일 관리
 */
const DiaryMediaToolbar = ({
  onAddMedia,
  onUpdateStyle,
  currentStyle,
  onSubmit,
  isLoading,
  isValid,
  isEditMode,
}: DiaryMediaToolbarPropsType) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState<any>(null);
  const [showFontModal, setShowFontModal] = useState(false);

  /**
   * 갤러리에서 이미지 선택
   */
  const handlePickImages = async () => {
    try {
      const images = await MediaService.pickMultipleImages(5);
      images.forEach(onAddMedia);
    } catch (error) {
      Alert.alert('오류', '이미지를 선택할 수 없습니다.');
    }
  };

  /**
   * 카메라로 사진 촬영
   */
  const handleTakePicture = async () => {
    try {
      const image = await MediaService.takePicture();
      if (image) {
        onAddMedia(image);
      }
    } catch (error) {
      Alert.alert('오류', '사진을 촬영할 수 없습니다.');
    }
  };

  /**
   * 동영상 선택/촬영 옵션 표시
   */
  const handleVideoOptions = () => {
    Alert.alert(
      '동영상 추가',
      '어떤 방법으로 동영상을 추가하시겠습니까?',
      [
        { text: '갤러리에서 선택', onPress: handlePickVideo },
        { text: '동영상 촬영', onPress: handleRecordVideo },
        { text: '취소', style: 'cancel' },
      ],
    );
  };

  /**
   * 갤러리에서 동영상 선택
   */
  const handlePickVideo = async () => {
    try {
      const video = await MediaService.pickVideo();
      if (video) {
        onAddMedia(video);
      }
    } catch (error) {
      Alert.alert('오류', '동영상을 선택할 수 없습니다.');
    }
  };

  /**
   * 동영상 촬영
   */
  const handleRecordVideo = async () => {
    try {
      const video = await MediaService.recordVideo();
      if (video) {
        onAddMedia(video);
      }
    } catch (error) {
      Alert.alert('오류', '동영상을 촬영할 수 없습니다.');
    }
  };

  /**
   * 음성 녹음 토글
   */
  const handleToggleRecording = async () => {
    if (isRecording) {
      // 녹음 중지
      try {
        if (recording) {
          const audioMedia = await MediaService.stopRecording(recording);
          onAddMedia(audioMedia);
          setIsRecording(false);
          setRecording(null);
          setRecordingDuration(0);
        }
      } catch (error) {
        Alert.alert('오류', '녹음을 저장할 수 없습니다.');
        setIsRecording(false);
        setRecording(null);
        setRecordingDuration(0);
      }
    } else {
      // 녹음 시작
      try {
        const newRecording = await MediaService.startRecording();
        setRecording(newRecording);
        setIsRecording(true);
        
        // 녹음 시간 업데이트 (1초마다)
        const interval = setInterval(() => {
          setRecordingDuration(prev => {
            if (!isRecording) {
              clearInterval(interval);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      } catch (error) {
        Alert.alert('오류', '녹음을 시작할 수 없습니다.');
      }
    }
  };

  /**
   * 사진 촬영 옵션 표시
   */
  const handleCameraOptions = () => {
    Alert.alert(
      '사진 추가',
      '어떤 방법으로 사진을 추가하시겠습니까?',
      [
        { text: '갤러리에서 선택', onPress: handlePickImages },
        { text: '사진 촬영', onPress: handleTakePicture },
        { text: '취소', style: 'cancel' },
      ],
    );
  };

  /**
   * 폰트 설정 모달 토글
   */
  const handleToggleFontModal = () => {
    setShowFontModal(!showFontModal);
  };

  /**
   * 시간 포맷팅 (mm:ss)
   */
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="border-t border-gray-200 bg-white">
      {/* 상단 툴바 */}
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* 미디어 추가 버튼들 */}
        <View className="flex-row gap-2">
          {/* 카메라/이미지 */}
          <TouchableOpacity
            onPress={handleCameraOptions}
            className="items-center justify-center rounded-lg bg-gray-100 p-2"
          >
            <Camera size={20} color="#576bcd" />
          </TouchableOpacity>

          {/* 동영상 */}
          <TouchableOpacity
            onPress={handleVideoOptions}
            className="items-center justify-center rounded-lg bg-gray-100 p-2"
          >
            <Video size={20} color="#576bcd" />
          </TouchableOpacity>

          {/* 음성 녹음 */}
          <TouchableOpacity
            onPress={handleToggleRecording}
            className={`items-center justify-center rounded-lg p-2 ${
              isRecording ? 'bg-red-100' : 'bg-gray-100'
            }`}
          >
            {isRecording ? (
              <MicOff size={20} color="#ff4444" />
            ) : (
              <Mic size={20} color="#576bcd" />
            )}
          </TouchableOpacity>

          {/* 폰트 설정 */}
          <TouchableOpacity
            onPress={handleToggleFontModal}
            className="items-center justify-center rounded-lg bg-gray-100 p-2"
          >
            <Type size={20} color="#576bcd" />
          </TouchableOpacity>
        </View>

        {/* 녹음 시간 표시 */}
        {isRecording && (
          <View className="flex-row items-center">
            <View className="mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <Text className="text-sm text-red-500">
              {formatDuration(recordingDuration)}
            </Text>
          </View>
        )}

        {/* 저장 버튼 */}
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!isValid || isLoading}
          className={`flex-row items-center rounded-lg px-4 py-2 ${
            isValid && !isLoading
              ? 'bg-paleCobalt'
              : 'bg-gray-300'
          }`}
        >
          <Save size={16} color="white" />
          <Text className="ml-1 text-sm font-medium text-white">
            {isLoading 
              ? '저장 중...' 
              : isEditMode 
                ? '수정' 
                : '저장'
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* 현재 스타일 표시 */}
      <View className="border-t border-gray-100 px-4 py-2">
        <Text className="text-xs text-gray">
          현재 설정: {currentStyle.fontFamily} {currentStyle.fontSize}pt • {
            currentStyle.textAlign === 'left' ? '왼쪽 정렬' :
            currentStyle.textAlign === 'center' ? '가운데 정렬' : '오른쪽 정렬'
          }
        </Text>
      </View>
    </View>
  );
};

export default DiaryMediaToolbar;