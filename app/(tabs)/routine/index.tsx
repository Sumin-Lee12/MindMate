import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AddButton from 'src/components/ui/add-button';
import Calendar from 'src/components/ui/calendar';
import RoutineListCard from 'src/features/routine/components/RoutineListCard';

// 더미 데이터
// TODO: 서버 연동 후 삭제
const routineList = [
  {
    id: 1,
    title: '책 읽기',
    time: '5:30 오후',
    duration: '15분',
  },
  {
    id: 2,
    title: '운동하기',
    time: '6:00 오후',
    duration: '30분',
  },
];

const RoutineMain = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 루틴 생성 페이지로 이동
  const handleCreateRoutine = () => {
    router.push('/routine/new');
  };

  // 루틴 수정 페이지로 이동
  const handleEditRoutine = (id: number) => {
    router.push(`/routine/${id}`);
  };

  // 루틴 삭제
  const handleDeleteRoutine = (id: number) => {
    /* TODO: 루틴 삭제 로직 */
    console.log('Delete routine:', id);
  };

  return (
    <View className="relative flex-1 bg-[#F5F7FB]">
      {/* 상단 달력 */}
      <View className="px-4 pb-4 pt-8">
        <Calendar selectedDate={selectedDate} onChange={setSelectedDate} />
      </View>

      {/* 루틴 리스트 */}
      <ScrollView className="flex-1 px-4">
        {routineList.map((routine) => (
          <RoutineListCard
            key={routine.id}
            title={routine.title}
            time={routine.time}
            duration={routine.duration}
            onEdit={() => handleEditRoutine(routine.id)}
            onDelete={() => handleDeleteRoutine(routine.id)}
          />
        ))}
      </ScrollView>

      {/* 플로팅 액션 버튼 */}
      <AddButton onPress={handleCreateRoutine} />
    </View>
  );
};

export default RoutineMain;
