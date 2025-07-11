/**
 * 반복 설정 관련 타입들
 */

// 반복 주기 타입
export type RepeatCycleType =
  | '없음'
  | '매일'
  | `${number}일마다`
  | `매주 ${WeekdayType}`
  | `매달 ${number}일`
  | `매달 ${WeekOrderType} ${WeekdayType}`;

// 요일 타입
export type WeekdayType = '월' | '화' | '수' | '목' | '금' | '토' | '일';

// 주차 타입
export type WeekOrderType = '첫째주' | '둘째주' | '셋째주' | '넷째주' | '마지막주';

// 반복 설정 상세 정보
export type RepeatCycleDetail = {
  type: 'daily' | 'interval' | 'weekly' | 'monthly' | 'monthlyWeek';
  value: {
    interval?: number; // X일마다의 경우
    weekday?: WeekdayType; // 요일
    day?: number; // 매달 X일의 경우
    weekOrder?: WeekOrderType; // 매달 X번째주의 경우
  };
};

/**
 * 루틴 관련 타입들
 */

export type RoutineType = {
  id: string;
  name: string;
  details?: string;
  imageUrl?: string;
  repeatCycle: RepeatCycleType;
  alarmTime?: string; // HH:mm 형식
  deadline?: string; // YYYY-MM-DD 형식
  subTasks: SubTaskType[];
  createdAt: string; //날짜+시간 형식(YYYY-MM-DD HH:mm:ss)
  updatedAt: string; //날짜+시간 형식(YYYY-MM-DD HH:mm:ss)
};

export type SubTaskType = {
  id: string;
  routineId: string;
  title: string;
  isCompleted: boolean;
  order: number;
};

export type CreateRoutinePayload = {
  name: string;
  details?: string;
  imageUrl?: string;
  repeatCycle: RepeatCycleType;
  alarmTime?: string;
  deadline?: string;
  startDate?: string; // 루틴 시작 날짜 (YYYY-MM-DD 형식)
  subTasks: Omit<SubTaskType, 'id' | 'routineId' | 'isCompleted'>[];
  createdAt?: string; // 생성일(YYYY-MM-DD 형식)
};

export type UpdateRoutinePayload = Partial<CreateRoutinePayload> & {
  id: string;
};

export type RoutineFormData = {
  name: string;
  details: string;
  imageUrl: string;
  repeatCycle: RepeatCycleType;
  alarmTime: string;
  deadline: string;
  subTasks: { title: string; order: number }[];
};
