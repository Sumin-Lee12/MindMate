/**
 * 루틴 관련 유틸리티 함수들
 */

import { RepeatCycleType, RepeatCycleDetail, WeekOrderType, WeekdayType } from './types';

/**
 * 반복 설정 문자열을 파싱하는 함수
 * @param cycle - 파싱할 반복 설정 문자열
 * @returns 파싱된 반복 설정 상세 정보 또는 null
 */
export const parseRepeatCycle = (cycle: string): RepeatCycleDetail | null => {
  // 매일
  if (cycle === '매일') {
    return { type: 'daily', value: {} };
  }

  // X일마다
  const intervalMatch = cycle.match(/^(\d+)일마다$/);
  if (intervalMatch) {
    return {
      type: 'interval',
      value: { interval: parseInt(intervalMatch[1]) },
    };
  }

  // 매주 요일
  const weekdays = ['월', '화', '수', '목', '금', '토', '일'] as const;
  const weeklyMatch = cycle.match(new RegExp(`^매주 (${weekdays.join('|')})$`));
  if (weeklyMatch) {
    return {
      type: 'weekly',
      value: { weekday: weeklyMatch[1] as WeekdayType },
    };
  }

  // 매달 X일
  const monthlyMatch = cycle.match(/^매달 (\d+)일$/);
  if (monthlyMatch) {
    return {
      type: 'monthly',
      value: { day: parseInt(monthlyMatch[1]) },
    };
  }

  // 매달 X번째주 요일
  const weekOrders = ['첫째주', '둘째주', '셋째주', '넷째주', '마지막주'] as const;
  const monthlyWeekMatch = cycle.match(
    new RegExp(`^매달 (${weekOrders.join('|')}) (${weekdays.join('|')})$`),
  );
  if (monthlyWeekMatch) {
    return {
      type: 'monthlyWeek',
      value: {
        weekOrder: monthlyWeekMatch[1] as WeekOrderType,
        weekday: monthlyWeekMatch[2] as WeekdayType,
      },
    };
  }

  return null; // 파싱 실패
};

/**
 * 반복 설정 상세 정보를 문자열로 변환하는 함수
 * @param detail - 변환할 반복 설정 상세 정보
 * @returns 반복 설정 문자열
 */
export const formatRepeatCycle = (detail: RepeatCycleDetail): RepeatCycleType => {
  switch (detail.type) {
    case 'daily':
      return '매일';
    case 'interval':
      return `${detail.value.interval}일마다` as RepeatCycleType;
    case 'weekly':
      return `매주 ${detail.value.weekday}` as RepeatCycleType;
    case 'monthly':
      return `매달 ${detail.value.day}일` as RepeatCycleType;
    case 'monthlyWeek':
      return `매달 ${detail.value.weekOrder} ${detail.value.weekday}` as RepeatCycleType;
    default:
      throw new Error('Invalid repeat cycle detail');
  }
};

/**
 * 특정 날짜에 루틴이 실행되어야 하는지 확인하는 함수
 * @param routine - 루틴 정보
 * @param targetDate - 확인할 날짜 (Date 객체)
 * @returns 해당 날짜에 루틴이 실행되어야 하면 true
 */
export const shouldRunOnDate = (
  routine: { repeatCycle: RepeatCycleType },
  targetDate: Date,
): boolean => {
  const detail = parseRepeatCycle(routine.repeatCycle);
  if (!detail) return false;

  const today = new Date();
  const target = new Date(targetDate);

  switch (detail.type) {
    case 'daily':
      return true;

    case 'interval':
      if (!detail.value.interval) return false;
      const daysDiff = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff % detail.value.interval === 0;

    case 'weekly':
      if (!detail.value.weekday) return false;
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const targetWeekday = weekdays[target.getDay()];
      return targetWeekday === detail.value.weekday;

    case 'monthly':
      if (!detail.value.day) return false;
      return target.getDate() === detail.value.day;

    case 'monthlyWeek':
      if (!detail.value.weekOrder || !detail.value.weekday) return false;
      return isNthWeekOfMonth(target, detail.value.weekOrder, detail.value.weekday);

    default:
      return false;
  }
};

/**
 * 특정 월의 N번째 주 요일인지 확인하는 함수
 * @param date - 확인할 날짜
 * @param weekOrder - 주차 (첫째주, 둘째주, ...)
 * @param weekday - 요일
 * @returns 해당 주차의 요일이면 true
 */
const isNthWeekOfMonth = (date: Date, weekOrder: string, weekday: string): boolean => {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const targetWeekdayIndex = weekdays.indexOf(weekday);

  // 해당 월의 첫 번째 해당 요일을 찾습니다
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekday = firstDay.getDay();
  const daysToAdd = (targetWeekdayIndex - firstWeekday + 7) % 7;
  const firstOccurrence = new Date(date.getFullYear(), date.getMonth(), 1 + daysToAdd);

  // 주차에 따른 날짜 계산
  let targetDate: Date;
  switch (weekOrder) {
    case '첫째주':
      targetDate = firstOccurrence;
      break;
    case '둘째주':
      targetDate = new Date(firstOccurrence.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    case '셋째주':
      targetDate = new Date(firstOccurrence.getTime() + 14 * 24 * 60 * 60 * 1000);
      break;
    case '넷째주':
      targetDate = new Date(firstOccurrence.getTime() + 21 * 24 * 60 * 60 * 1000);
      break;
    case '마지막주':
      // 다음 달의 첫 번째 해당 요일에서 7일을 빼면 마지막 주
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      const nextMonthFirstWeekday = nextMonth.getDay();
      const nextMonthDaysToAdd = (targetWeekdayIndex - nextMonthFirstWeekday + 7) % 7;
      const nextMonthFirstOccurrence = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1 + nextMonthDaysToAdd,
      );
      targetDate = new Date(nextMonthFirstOccurrence.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      return false;
  }

  return date.getDate() === targetDate.getDate();
};

/**
 * 반복 설정의 다음 실행 날짜를 계산하는 함수
 * @param routine - 루틴 정보
 * @param fromDate - 시작 날짜 (기본값: 오늘)
 * @returns 다음 실행 날짜
 */
export const getNextRunDate = (
  routine: { repeatCycle: RepeatCycleType },
  fromDate: Date = new Date(),
): Date => {
  const detail = parseRepeatCycle(routine.repeatCycle);
  if (!detail) return fromDate;

  const result = new Date(fromDate);

  switch (detail.type) {
    case 'daily':
      result.setDate(result.getDate() + 1);
      break;

    case 'interval':
      if (detail.value.interval) {
        result.setDate(result.getDate() + detail.value.interval);
      }
      break;

    case 'weekly':
      if (detail.value.weekday) {
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const targetWeekdayIndex = weekdays.indexOf(detail.value.weekday);
        const currentWeekdayIndex = result.getDay();
        let daysToAdd = (targetWeekdayIndex - currentWeekdayIndex + 7) % 7;
        if (daysToAdd === 0) daysToAdd = 7; // 같은 요일이면 다음 주로
        result.setDate(result.getDate() + daysToAdd);
      }
      break;

    case 'monthly':
      if (detail.value.day) {
        result.setMonth(result.getMonth() + 1);
        result.setDate(detail.value.day);
      }
      break;

    case 'monthlyWeek':
      // 다음 달의 해당 주차 요일로 설정
      if (detail.value.weekOrder && detail.value.weekday) {
        result.setMonth(result.getMonth() + 1);
        result.setDate(1);
        // 해당 월의 첫 번째 해당 요일을 찾고 주차에 따라 계산
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const targetWeekdayIndex = weekdays.indexOf(detail.value.weekday);
        const firstWeekday = result.getDay();
        const daysToAdd = (targetWeekdayIndex - firstWeekday + 7) % 7;

        let targetDay = 1 + daysToAdd;
        switch (detail.value.weekOrder) {
          case '첫째주':
            break;
          case '둘째주':
            targetDay += 7;
            break;
          case '셋째주':
            targetDay += 14;
            break;
          case '넷째주':
            targetDay += 21;
            break;
          case '마지막주':
            targetDay += 28;
            break;
        }
        result.setDate(targetDay);
      }
      break;
  }

  return result;
};

/**
 * 반복 설정을 사용자 친화적인 텍스트로 변환하는 함수
 * @param repeatCycle - 반복 설정
 * @returns 사용자 친화적인 설명
 */
export const getRepeatCycleDescription = (repeatCycle: RepeatCycleType): string => {
  const detail = parseRepeatCycle(repeatCycle);
  if (!detail) return '반복 설정 없음';

  switch (detail.type) {
    case 'daily':
      return '매일 반복';
    case 'interval':
      return `${detail.value.interval}일마다 반복`;
    case 'weekly':
      return `매주 ${detail.value.weekday}요일 반복`;
    case 'monthly':
      return `매달 ${detail.value.day}일 반복`;
    case 'monthlyWeek':
      return `매달 ${detail.value.weekOrder} ${detail.value.weekday}요일 반복`;
    default:
      return '알 수 없는 반복 설정';
  }
};
