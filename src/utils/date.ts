/**
 * 주어진 날짜(date)에서 days만큼 더한 새 Date 객체를 반환합니다.
 * @param date 기준 날짜
 * @param days 더할 일 수(음수도 가능)
 * @returns days만큼 더한 새 Date 객체
 */
export const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * 주어진 날짜(date)가 속한 주(일요일~토요일) 중 일요일을 반환합니다.
 * @param date 기준 날짜
 * @returns 해당 주의 시작(일요일) Date 객체
 */
export const getWeekStart = (date: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
};

/**
 * 두 날짜가 연/월/일이 모두 같으면 true를 반환합니다.
 * @param a 비교할 날짜1
 * @param b 비교할 날짜2
 * @returns 같은 날이면 true, 아니면 false
 */
export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
