/**
 * 현재 날짜와 시간을 포맷팅
 * @returns 포맷팅된 날짜 시간 문자열
 */
export const formatDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? '오후' : '오전';
  const displayHours = hours > 12 ? hours - 12 : hours || 12;

  return `${year}. ${month}. ${day}. ${weekday}요일 ${period} ${displayHours}: ${minutes}`;
};

/**
 * 날짜 문자열을 포맷팅
 * @param datetime - ISO 날짜 문자열
 * @returns 포맷팅된 날짜 시간 문자열
 */
export const formatDateTimeString = (datetime: string) => {
  const date = new Date(datetime);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? '오후' : '오전';
  const displayHours = hours > 12 ? hours - 12 : hours || 12;

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}요일 ${period} ${displayHours}:${minutes}`;
};
