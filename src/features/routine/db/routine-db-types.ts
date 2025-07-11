/**
 * 루틴 관련 데이터베이스 타입 정의
 * SQLite DB 스키마와 연동하기 위한 TypeScript 타입들
 */

/**
 * 루틴 테이블 타입
 * 사용자가 생성한 루틴의 기본 정보를 저장
 */
export type RoutineDbType = {
  id: number;
  name: string;
  details: string | null;
  image_url: string | null;
  repeat_cycle: string;
  alarm_time: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * 루틴 실행 기록 테이블 타입
 * 루틴이 실제로 실행된 기록을 저장
 */
export type RoutineExecutionDbType = {
  id: number;
  routine_id: number;
  execution_date: string;
  scheduled_date: string;
  status: 'scheduled' | 'completed' | 'skipped' | 'failed';
  completed_at: string | null;
  created_at: string;
};

/**
 * 하위 작업 테이블 타입
 * 루틴을 구성하는 개별 작업들을 저장
 */
export type SubTaskDbType = {
  id: number;
  routine_id: number;
  title: string;
  order_index: number;
  is_completed: number; // 0: 미완료, 1: 완료
  created_at: string;
  updated_at: string;
};

/**
 * 하위 작업 실행 기록 테이블 타입
 * 하위 작업의 완료 상태를 기록
 */
export type SubTaskExecutionDbType = {
  id: number;
  sub_task_id: number;
  routine_execution_id: number;
  is_completed: number; // 0: 미완료, 1: 완료
  completed_at: string | null;
  created_at: string;
};

/**
 * 루틴 통계 테이블 타입
 * 루틴의 실행 통계 정보를 저장
 */
export type RoutineStatisticsDbType = {
  id: number;
  routine_id: number;
  year: number | null;
  month: number | null;
  total_scheduled: number;
  total_completed: number;
  total_skipped: number;
  total_failed: number;
  completion_rate: number;
  avg_completion_time: number;
  created_at: string;
  updated_at: string;
};

// DB 쿼리 결과 타입들

/**
 * 루틴과 하위 작업을 함께 조회할 때 사용하는 타입
 */
export type RoutineWithSubTasksType = RoutineDbType & {
  subTasks: SubTaskDbType[];
};

/**
 * 루틴 실행 기록과 하위 작업 실행 기록을 함께 조회할 때 사용하는 타입
 */
export type RoutineExecutionWithSubTasksType = RoutineExecutionDbType & {
  subTaskExecutions: SubTaskExecutionDbType[];
};

// DB 입력용 타입들 (ID 제외)

/**
 * 루틴 생성 시 사용하는 타입 (ID와 타임스탬프 제외)
 */
export type CreateRoutineDbType = Omit<RoutineDbType, 'id' | 'created_at' | 'updated_at'>;

/**
 * 루틴 수정 시 사용하는 타입 (ID와 타임스탬프 제외, 모든 필드 선택사항)
 */
export type UpdateRoutineDbType = Partial<Omit<RoutineDbType, 'id' | 'created_at' | 'updated_at'>>;

/**
 * 하위 작업 생성 시 사용하는 타입 (ID와 타임스탬프 제외)
 */
export type CreateSubTaskDbType = Omit<SubTaskDbType, 'id' | 'created_at' | 'updated_at'>;

/**
 * 하위 작업 수정 시 사용하는 타입 (ID와 타임스탬프 제외, 모든 필드 선택사항)
 */
export type UpdateSubTaskDbType = Partial<Omit<SubTaskDbType, 'id' | 'created_at' | 'updated_at'>>;

// DB 쿼리 옵션 타입들

/**
 * 루틴 조회 시 사용하는 옵션 타입
 */
export type RoutineQueryOptions = {
  date?: string; // YYYY-MM-DD 형식
  limit?: number;
  offset?: number;
  includeSubTasks?: boolean;
};

/**
 * 하위 작업 조회 시 사용하는 옵션 타입
 */
export type SubTaskQueryOptions = {
  routineId: number;
  includeExecutions?: boolean;
};
