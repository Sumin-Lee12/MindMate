import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import { DiaryMediaType, RecordingStateType } from '../types';
import { UseFormSetValue } from 'react-hook-form';

/**
 * 오디오 녹음 관리 훅
 */
export const useAudioRecording = (
  watchedMedia: DiaryMediaType[],
  setValue: UseFormSetValue<any>,
) => {
  const [recordingState, setRecordingState] = useState<RecordingStateType>({
    isRecording: false,
    duration: 0,
  });
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [recordingInterval, setRecordingInterval] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

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
        if (recordingInterval) {
          clearInterval(recordingInterval);
          setRecordingInterval(null);
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

        const startTime = new Date();
        setRecordingState({
          isRecording: true,
          startTime,
          duration: 0,
          recording,
        });

        // 녹음 시간 업데이트
        const interval = setInterval(() => {
          setRecordingState((prev) => ({
            ...prev,
            duration: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
          }));
        }, 1000);
        setRecordingInterval(interval);
      }
    } catch (error) {
      console.error('음성 녹음 실패:', error);
      Alert.alert('오류', '음성 녹음 중 오류가 발생했습니다.');
    }
  };

  return {
    recordingState,
    audioUri,
    handleAudioRecording,
  };
};
