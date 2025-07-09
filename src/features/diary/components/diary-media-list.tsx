import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { X, Play, Volume2 } from 'lucide-react-native';
import type { DiaryMediaType } from '../types';
import { MediaService } from '../services/media-service';

type DiaryMediaListPropsType = {
  /** 미디어 목록 */
  media: DiaryMediaType[];
  /** 편집 모드 여부 (삭제 버튼 표시) */
  editable?: boolean;
  /** 미디어 클릭 시 콜백 */
  onMediaPress?: (media: DiaryMediaType) => void;
  /** 미디어 제거 시 콜백 */
  onRemoveMedia?: (mediaId: string) => void;
};

/**
 * 일기에 첨부된 미디어 목록을 표시하는 컴포넌트
 * 이미지, 동영상, 오디오 파일을 썸네일과 함께 표시
 */
const DiaryMediaList = ({ 
  media, 
  editable = false, 
  onMediaPress,
  onRemoveMedia 
}: DiaryMediaListPropsType) => {

  /**
   * 미디어 삭제 확인
   */
  const handleDeleteMedia = (mediaItem: DiaryMediaType) => {
    Alert.alert(
      '미디어 삭제',
      '이 미디어를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => onRemoveMedia?.(mediaItem.id),
        },
      ],
    );
  };

  /**
   * 미디어 아이템 렌더링
   */
  const renderMediaItem = (mediaItem: DiaryMediaType, index: number) => {
    return (
      <TouchableOpacity
        key={mediaItem.id}
        onPress={() => onMediaPress?.(mediaItem)}
        className="relative mr-3 overflow-hidden rounded-lg"
        style={{ width: 100, height: 100 }}
      >
        {/* 이미지 */}
        {mediaItem.type === 'image' && (
          <Image
            source={{ uri: mediaItem.uri }}
            className="h-full w-full"
            resizeMode="cover"
          />
        )}

        {/* 동영상 썸네일 */}
        {mediaItem.type === 'video' && (
          <View className="h-full w-full items-center justify-center bg-gray-200">
            {mediaItem.thumbnail ? (
              <Image
                source={{ uri: mediaItem.thumbnail }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center bg-gray-300">
                <Play size={32} color="#666" />
              </View>
            )}
            
            {/* 재생 시간 오버레이 */}
            {mediaItem.duration && (
              <View className="absolute bottom-1 right-1 rounded bg-black bg-opacity-70 px-1">
                <Text className="text-xs text-white">
                  {MediaService.formatDuration(mediaItem.duration)}
                </Text>
              </View>
            )}
            
            {/* 동영상 아이콘 */}
            <View className="absolute left-1 top-1">
              <Play size={16} color="white" />
            </View>
          </View>
        )}

        {/* 오디오 */}
        {mediaItem.type === 'audio' && (
          <View className="h-full w-full items-center justify-center bg-teal">
            <Volume2 size={32} color="#576bcd" />
            {mediaItem.duration && (
              <Text className="mt-1 text-xs text-paleCobalt">
                {MediaService.formatDuration(mediaItem.duration)}
              </Text>
            )}
          </View>
        )}

        {/* 삭제 버튼 (편집 모드) */}
        {editable && (
          <TouchableOpacity
            onPress={() => handleDeleteMedia(mediaItem)}
            className="absolute -right-1 -top-1 h-6 w-6 items-center justify-center rounded-full bg-red-500"
          >
            <X size={14} color="white" />
          </TouchableOpacity>
        )}

        {/* 파일 크기 표시 */}
        {mediaItem.size && (
          <View className="absolute bottom-1 left-1 rounded bg-black bg-opacity-70 px-1">
            <Text className="text-xs text-white">
              {MediaService.formatFileSize(mediaItem.size)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (media.length === 0) {
    return null;
  }

  return (
    <View className="mb-4">
      <Text className="mb-2 px-4 text-sm font-medium text-gray">
        첨부파일 ({media.length})
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="flex-row"
      >
        {media.map(renderMediaItem)}
      </ScrollView>

      {/* 미디어 통계 */}
      <View className="mt-2 flex-row justify-center">
        <Text className="text-xs text-gray">
          이미지 {media.filter(m => m.type === 'image').length}개 • 
          동영상 {media.filter(m => m.type === 'video').length}개 • 
          음성 {media.filter(m => m.type === 'audio').length}개
        </Text>
      </View>
    </View>
  );
};

/**
 * 미디어 상세 보기 모달 컴포넌트 Props 타입
 */
type DiaryMediaViewerPropsType = {
  /** 표시할 미디어 */
  media: DiaryMediaType | null;
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 닫기 콜백 */
  onClose: () => void;
};

/**
 * 미디어 상세 보기 모달을 위한 컴포넌트
 */
export const DiaryMediaViewer = ({ 
  media, 
  visible, 
  onClose 
}: DiaryMediaViewerPropsType) => {
  if (!visible || !media) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-black bg-opacity-90">
      <TouchableOpacity
        onPress={onClose}
        className="absolute right-4 top-12 z-10 h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-20"
      >
        <X size={24} color="white" />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center p-4">
        {media.type === 'image' && (
          <Image
            source={{ uri: media.uri }}
            className="max-h-full max-w-full"
            resizeMode="contain"
          />
        )}

        {media.type === 'video' && (
          <View className="items-center justify-center">
            <Text className="text-white">동영상 재생 기능</Text>
            <Text className="mt-2 text-sm text-gray">
              {media.duration && `재생시간: ${MediaService.formatDuration(media.duration)}`}
            </Text>
          </View>
        )}

        {media.type === 'audio' && (
          <View className="items-center justify-center">
            <Volume2 size={64} color="white" />
            <Text className="mt-4 text-white">음성 재생 기능</Text>
            <Text className="mt-2 text-sm text-gray">
              {media.duration && `재생시간: ${MediaService.formatDuration(media.duration)}`}
            </Text>
          </View>
        )}
      </View>

      {/* 미디어 정보 */}
      <View className="absolute bottom-4 left-4 right-4 rounded-lg bg-black bg-opacity-50 p-3">
        <Text className="text-sm text-white">
          파일 크기: {MediaService.formatFileSize(media.size)}
        </Text>
        {media.duration && (
          <Text className="text-sm text-white">
            재생 시간: {MediaService.formatDuration(media.duration)}
          </Text>
        )}
      </View>
    </View>
  );
};

export default DiaryMediaList;