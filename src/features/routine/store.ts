/**
 * 루틴 관련 Zustand 상태 관리
 */

import { create } from 'zustand';
import { RoutineType } from './types';

type RoutineStore = {
  // 상태
  routines: RoutineType[];
  selectedDate: string;
  isLoading: boolean;
  error: string | null;

  // 액션
  setRoutines: (routines: RoutineType[]) => void;
  setSelectedDate: (date: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addRoutine: (routine: RoutineType) => void;
  updateRoutine: (id: string, routine: Partial<RoutineType>) => void;
  removeRoutine: (id: string) => void;
  clearError: () => void;
};

export const useRoutineStore = create<RoutineStore>((set) => ({
  // 초기 상태
  routines: [],
  selectedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
  isLoading: false,
  error: null,

  // 액션
  setRoutines: (routines) => set({ routines }),

  setSelectedDate: (selectedDate) => set({ selectedDate }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  addRoutine: (routine) =>
    set((state) => ({
      routines: [...state.routines, routine],
    })),

  updateRoutine: (id, updatedRoutine) =>
    set((state) => ({
      routines: state.routines.map((routine) =>
        routine.id === id ? { ...routine, ...updatedRoutine } : routine,
      ),
    })),

  removeRoutine: (id) =>
    set((state) => ({
      routines: state.routines.filter((routine) => routine.id !== id),
    })),

  clearError: () => set({ error: null }),
}));
