import { z } from 'zod';
import { Audio } from 'expo-av';

/**
 * 기분 타입
 */
export type MoodType = 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad';

/**
 * 기분 옵션 타입
 */
export type MoodOptionType = {
  value: MoodType;
  emoji: string;
  label: string;
  description: string;
};

/**
 * 기분 옵션 상수
 */
export const MOOD_OPTIONS: MoodOptionType[] = [
  {
    value: 'very-happy',
    emoji: '😊',
    label: '매우 행복해요',
    description: '정말 기분이 좋고 행복한 하루',
  },
  {
    value: 'happy',
    emoji: '🙂',
    label: '행복해요',
    description: '기분이 좋고 즐거운 하루',
  },
  {
    value: 'neutral',
    emoji: '😐',
    label: '보통이에요',
    description: '평범하고 무난한 하루',
  },
  {
    value: 'sad',
    emoji: '😞',
    label: '슬퍼요',
    description: '마음이 아프고 우울한 기분',
  },
  {
    value: 'very-sad',
    emoji: '😠',
    label: '매우 슬퍼요',
    description: '힘들고 어려운 하루',
  },
];

/**
 * 일기 스타일 타입
 */
export type DiaryStyleType = {
  fontFamily: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  backgroundColor: string;
};

/**
 * 일기 미디어 타입
 */
export type DiaryMediaType = {
  id: string;
  type: 'image' | 'video' | 'audio';
  uri: string;
  duration?: number;
};

/**
 * 녹음 상태 타입
 */
export type RecordingStateType = {
  isRecording: boolean;
  duration: number;
  startTime?: Date;
  recording?: Audio.Recording;
};

/**
 * 일기 폼 스키마
 */
export const diaryFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  mood: z.enum(['very-happy', 'happy', 'neutral', 'sad', 'very-sad']).optional(),
  media: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['image', 'video', 'audio']),
      uri: z.string(),
      duration: z.number().optional(),
    }),
  ),
  style: z.object({
    fontFamily: z.string(),
    fontSize: z.number(),
    textAlign: z.enum(['left', 'center', 'right']),
    textColor: z.string(),
    backgroundColor: z.string(),
  }),
});

/**
 * 일기 폼 데이터 타입
 */
export type DiaryFormDataType = z.infer<typeof diaryFormSchema>;
