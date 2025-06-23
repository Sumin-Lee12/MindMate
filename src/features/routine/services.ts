/**
 * 루틴 관련 API 함수들
 */

import { RoutineType, CreateRoutinePayload, UpdateRoutinePayload } from './types';

/**
 * 모든 루틴을 가져옵니다.
 * @param date - 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns 해당 날짜의 루틴 목록
 */
export const fetchGetRoutines = async (date?: string): Promise<RoutineType[]> => {
  // TODO: 실제 API 구현
  return [];
};

/**
 * 특정 루틴을 가져옵니다.
 * @param id - 루틴 ID
 * @returns 루틴 상세 정보
 */
export const fetchGetRoutineById = async (id: string): Promise<RoutineType> => {
  // TODO: 실제 API 구현
  throw new Error('Not implemented');
};

/**
 * 새로운 루틴을 생성합니다.
 * @param payload - 생성할 루틴 데이터
 * @returns 생성된 루틴 정보
 */
export const fetchCreateRoutine = async (payload: CreateRoutinePayload): Promise<RoutineType> => {
  // TODO: 실제 API 구현
  throw new Error('Not implemented');
};

/**
 * 루틴을 수정합니다.
 * @param payload - 수정할 루틴 데이터
 * @returns 수정된 루틴 정보
 */
export const fetchUpdateRoutine = async (payload: UpdateRoutinePayload): Promise<RoutineType> => {
  // TODO: 실제 API 구현
  throw new Error('Not implemented');
};

/**
 * 루틴을 삭제합니다.
 * @param id - 삭제할 루틴 ID
 */
export const fetchDeleteRoutine = async (id: string): Promise<void> => {
  // TODO: 실제 API 구현
  throw new Error('Not implemented');
};

/**
 * 반복 설정이 유효한지 검증합니다.
 * @param repeatCycle - 검증할 반복 설정
 * @returns 유효성 검증 결과
 */
export const validateRepeatCycle = (repeatCycle: string): boolean => {
  const weekdays = ['월', '화', '수', '목', '금', '토', '일'] as const;
  const weekOrders = ['첫째주', '둘째주', '셋째주', '넷째주', '마지막주'] as const;

  const validPatterns = [
    /^매일$/,
    /^\d+일마다$/,
    new RegExp(`^매주 (${weekdays.join('|')})$`),
    /^매달 \d+일$/,
    new RegExp(`^매달 (${weekOrders.join('|')}) (${weekdays.join('|')})$`),
  ];

  return validPatterns.some((pattern) => pattern.test(repeatCycle));
};
