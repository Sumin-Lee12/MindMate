import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
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
  const [selectedDate, setSelectedDate] = useState(new Date());

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
            onEdit={() => {
              /* TODO: 편집 */
            }}
            onDelete={() => {
              /* TODO: 삭제 */
            }}
          />
        ))}
      </ScrollView>

      {/* 플로팅 액션 버튼 */}
      <AddButton
        onPress={() => {
          /* TODO: 루틴 생성 이동 */
        }}
      />
    </View>
  );
};

export default RoutineMain;
