/**
 * 일기 스타일 설정 관련 상수들
 *
 * 일기 작성 시 사용할 수 있는 스타일 옵션들을 정의합니다.
 */

/**
 * 사용 가능한 폰트 크기 옵션
 */
export const FONT_SIZE_OPTIONS = [12, 14, 16, 18, 20, 24, 28, 32] as const;

/**
 * 텍스트 정렬 옵션
 */
export const TEXT_ALIGN_OPTIONS: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];

/**
 * 텍스트 정렬 옵션의 한국어 라벨
 */
export const TEXT_ALIGN_LABELS: Record<'left' | 'center' | 'right', string> = {
  left: '왼쪽',
  center: '가운데',
  right: '오른쪽',
} as const;

/**
 * 사용 가능한 배경색 옵션
 */
export const BACKGROUND_COLOR_OPTIONS = [
  '#FFFFFF', // 화이트
  '#F5F7FF', // 연한 블루
  '#FFE5BC', // 연한 오렌지
  '#C9EFEF', // 연한 터키석
  '#FFD7DD', // 연한 핑크
] as const;

/**
 * 기본 스타일 설정
 */
export const DEFAULT_DIARY_STYLE = {
  fontFamily: 'default',
  fontSize: 16,
  textAlign: 'left' as const,
  textColor: '#000000',
  backgroundColor: '#FFFFFF',
} as const;
