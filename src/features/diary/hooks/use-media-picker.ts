import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DiaryMediaType } from '../types';
import { UseFormSetValue } from 'react-hook-form';

/**
 * 미디어 선택 관리 훅
 */
export const useMediaPicker = (watchedMedia: DiaryMediaType[], setValue: UseFormSetValue<any>) => {
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

  return {
    handleImagePicker,
    handleVideoPicker,
  };
};
