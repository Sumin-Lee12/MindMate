/**
 * 일기 관련 타입 정의 및 Zod 스키마
 */

import { z } from 'zod';

/**
 * 기분/감정 타입 (이모티콘 기반)
 */
export type MoodType = 'very-happy' | 'happy' | 'neutral' | 'sad' | 'very-sad';

/**
 * 미디어 파일 타입
 */
export type DiaryMediaType = {
  /** 미디어 고유 ID */
  id: string;
  /** 미디어 타입 */
  type: 'image' | 'video' | 'audio';
  /** 파일 경로 URI */
  uri: string;
  /** 썸네일 이미지 URI (비디오용) */
  thumbnail?: string;
  /** 파일 크기 (bytes) */
  size?: number;
  /** 재생 시간 (초, 오디오/비디오용) */
  duration?: number;
};

/**
 * 일기 스타일 설정 타입
 */
export type DiaryStyleType = {
  /** 폰트 패밀리 */
  fontFamily: string;
  /** 폰트 크기 */
  fontSize: number;
  /** 텍스트 정렬 */
  textAlign: 'left' | 'center' | 'right';
  /** 텍스트 색상 */
  textColor?: string;
  /** 배경 색상 */
  backgroundColor?: string;
};

/**
 * 일기 아이템 타입
 */
export type DiaryItemType = {
  /** 일기 고유 ID */
  id: string;
  /** 일기 제목 */
  title: string;
  /** 일기 내용 */
  content: string;
  /** 첨부된 미디어 파일들 */
  media: DiaryMediaType[];
  /** 텍스트 스타일 설정 */
  style: DiaryStyleType;
  /** 기분/감정 */
  mood?: MoodType;
  /** 생성 일시 */
  createdAt: string;
  /** 수정 일시 */
  updatedAt: string;
};

/**
 * 일기 생성 요청 타입
 */
export type DiaryCreatePayloadType = Omit<DiaryItemType, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 일기 수정 요청 타입
 */
export type DiaryUpdatePayloadType = Partial<DiaryCreatePayloadType> & {
  id: string;
};

/**
 * 일기 임시 저장 타입 (작성 중)
 */
export type DiaryDraftType = {
  /** 제목 */
  title: string;
  /** 내용 */
  content: string;
  /** 미디어 파일들 */
  media: DiaryMediaType[];
  /** 스타일 설정 */
  style: DiaryStyleType;
  /** 기분 */
  mood?: MoodType;
};

/**
 * 녹음 상태 타입
 */
export type RecordingStateType = {
  /** 녹음 중 여부 */
  isRecording: boolean;
  /** 녹음 시작 시간 */
  startTime?: Date;
  /** 현재 녹음 시간 (초) */
  duration: number;
  /** 녹음 객체 */
  recording?: any;
};

/**
 * 폰트 옵션 타입
 */
export type FontOptionType = {
  /** 폰트 이름 */
  name: string;
  /** 폰트 패밀리 */
  value: string;
  /** 미리보기 텍스트 */
  preview: string;
};

/**
 * 기분 옵션 타입 (이모티콘 기반)
 */
export type MoodOptionType = {
  /** 기분 값 */
  value: MoodType;
  /** 이모티콘 */
  emoji: string;
  /** 기분 이름 */
  label: string;
  /** 기분 설명 */
  description: string;
};

/**
 * 일기 필터 옵션 타입
 */
export type DiaryFilterType = {
  /** 시작 날짜 */
  startDate?: string;
  /** 종료 날짜 */
  endDate?: string;
  /** 기분 필터 */
  mood?: MoodType;
  /** 미디어 포함 여부 */
  hasMedia?: boolean;
  /** 검색 키워드 */
  keyword?: string;
};

/**
 * 일기 정렬 옵션 타입
 */
export type DiarySortType = 'createdAt_desc' | 'createdAt_asc' | 'updatedAt_desc' | 'title_asc';

// ========================
// Zod 스키마 정의
// ========================

/**
 * 미디어 검증 스키마
 */
export const diaryMediaSchema = z.object({
  id: z.string().min(1, '미디어 ID가 필요합니다'),
  type: z.enum(['image', 'video', 'audio'], {
    errorMap: () => ({ message: '올바른 미디어 타입을 선택해주세요' }),
  }),
  uri: z.string().min(1, '파일 경로가 필요합니다'),
  thumbnail: z.string().optional(),
  size: z.number().positive().optional(),
  duration: z.number().positive().optional(),
});

/**
 * 스타일 검증 스키마
 */
export const diaryStyleSchema = z.object({
  fontFamily: z.string().min(1, '폰트를 선택해주세요'),
  fontSize: z.number().min(12).max(32, '폰트 크기는 12~32 사이여야 합니다'),
  textAlign: z.enum(['left', 'center', 'right']),
  textColor: z.string().optional(),
  backgroundColor: z.string().optional(),
});

/**
 * 기분 검증 스키마
 */
export const moodSchema = z
  .enum(['very-happy', 'happy', 'neutral', 'sad', 'very-sad'], {
    errorMap: () => ({ message: '올바른 기분을 선택해주세요' }),
  })
  .optional();

/**
 * 일기 생성/수정 폼 검증 스키마
 */
export const diaryFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100, '제목은 100자 이하로 작성해주세요'),
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(10000, '내용은 10,000자 이하로 작성해주세요'),
  media: z.array(diaryMediaSchema).default([]),
  style: diaryStyleSchema,
  mood: moodSchema,
});

/**
 * 일기 폼 데이터 타입 (react-hook-form용)
 */
export type DiaryFormDataType = z.infer<typeof diaryFormSchema>;

/**
 * 일기 검색 폼 스키마
 */
export const diarySearchFormSchema = z.object({
  keyword: z.string().max(50, '검색어는 50자 이하로 입력해주세요').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  mood: moodSchema,
  hasMedia: z.boolean().optional(),
});

/**
 * 일기 검색 폼 데이터 타입
 */
export type DiarySearchFormDataType = z.infer<typeof diarySearchFormSchema>;

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
 * 기분별 색상 테마
 */
export const MOOD_COLORS: Record<MoodType, string> = {
  'very-happy': '#FF6B6B',
  happy: '#4ECDC4',
  neutral: '#95A5A6',
  sad: '#6C5CE7',
  'very-sad': '#2C3E50',
};
