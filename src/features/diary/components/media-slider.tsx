import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Dimensions, Text, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, Mic, Play, Pause } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';
import { Audio } from 'expo-av';
import { Colors } from '../../../constants/colors';

type MediaSliderProps = {
  media: Array<{
    id: number;
    mediaType: string;
    filePath: string;
  }>;
};

const { width: screenWidth } = Dimensions.get('window');

const MediaSlider = ({ media }: MediaSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentMedia = media[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const handleAudioPress = async () => {
    try {
      if (!isPlaying) {
        if (sound) {
          await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: currentMedia.filePath },
          { shouldPlay: true },
        );

        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) {
            console.warn('오디오 로딩 실패:', status);
            return;
          }

          if (!status.isPlaying && status.didJustFinish) {
            setIsPlaying(false);
            setSound(null);
          }
        });
      } else {
        if (sound) {
          await sound.pauseAsync();
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error('오디오 재생 오류:', error);
    }
  };

  // 슬라이드 변경 시 기존 사운드 정리
  useEffect(() => {
    setIsPlaying(false);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  }, [currentIndex]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  if (media.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        {currentMedia.mediaType === 'image' ? (
          <Image
            source={{ uri: currentMedia.filePath }}
            style={styles.media}
            resizeMode="contain"
          />
        ) : currentMedia.mediaType === 'video' ? (
          <Video
            source={{ uri: currentMedia.filePath }}
            style={styles.media}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            isLooping
          />
        ) : currentMedia.mediaType === 'audio' ? (
          <TouchableOpacity onPress={handleAudioPress} style={styles.audioContainer}>
            {isPlaying ? (
              <Pause size={48} color={Colors.paleCobalt} />
            ) : (
              <Play size={48} color={Colors.paleCobalt} />
            )}
            <Text style={styles.audioText}>{isPlaying ? '재생 중...' : '음성 파일 재생'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* 좌우 네비게이션 버튼 */}
      {media.length > 1 && (
        <>
          <TouchableOpacity onPress={handlePrevious} style={styles.prevButton}>
            <ChevronLeft size={24} color={Colors.paleCobalt} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <ChevronRight size={24} color={Colors.paleCobalt} />
          </TouchableOpacity>
        </>
      )}

      {/* 페이지 인디케이터 */}
      {media.length > 1 && (
        <View style={styles.indicatorContainer}>
          {media.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  mediaContainer: {
    marginHorizontal: 0,
    width: screenWidth,
    height: screenWidth * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  audioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.paleCobalt,
    backgroundColor: '#F5F8FF',
  },
  audioText: {
    marginTop: 12,
    color: Colors.paleCobalt,
    fontSize: 14,
  },
  prevButton: {
    position: 'absolute',
    left: 24,
    top: '50%',
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#CCD4FF',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -20 }],
  },
  nextButton: {
    position: 'absolute',
    right: 24,
    top: '50%',
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#CCD4FF',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -20 }],
  },
  indicatorContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicatorDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.paleCobalt,
  },
  inactiveDot: {
    backgroundColor: '#999999',
  },
});

export { MediaSlider };
