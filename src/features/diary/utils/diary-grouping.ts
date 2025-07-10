/**
 * 두 날짜가 같은 주인지 확인
 * @param d1 - 첫 번째 날짜
 * @param d2 - 두 번째 날짜
 * @returns 같은 주이면 true
 */
const isSameWeek = (d1: Date, d2: Date) => {
  const oneJan = new Date(d1.getFullYear(), 0, 1);
  const week1 = Math.ceil(((d1.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
  const week2 = Math.ceil(((d2.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
  return d1.getFullYear() === d2.getFullYear() && week1 === week2;
};

/**
 * 일기를 기간별로 그룹화
 * @param diaries - 일기 목록
 * @returns 기간별로 그룹화된 일기 객체
 */
export const groupDiariesByPeriod = (diaries: any[]) => {
  return diaries.reduce((acc: any, item) => {
    const date = new Date(item.created_at ?? '');
    const now = new Date();
    let section = '과거';

    if (isSameWeek(date, now)) {
      section = '이번 주';
    } else if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() - 1) {
      section = '지난 달';
    } else if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
      section = '이번 달';
    } else {
      section = '과거';
    }

    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {});
};
