import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import AddButton from 'src/components/ui/add-button';
import CheckBox from 'src/components/ui/checkbox';
import Label from 'src/components/ui/label';
import Modal from 'src/components/ui/modal';
import Calendar from 'src/components/ui/calendar';
import SubRoutineTaskCard from '@/src/features/routine/components/SubRoutineTaskCard';
import RepeatInfoModal from 'src/features/routine/components/RepeatInfoModal';
import AlarmTimePicker from 'src/features/routine/components/AlarmTimePicker';
import SubRoutineTaskCheckCard from '@/src/features/routine/components/SubRoutineTaskCheckCard';
import RoutineListCard from 'src/features/routine/components/RoutineListCard';
import { useRouter } from 'expo-router';

const RoutineMain = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [repeatInfoVisible, setRepeatInfoVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [taskChecks, setTaskChecks] = useState([true, false, false]);

  // 더미 하위 작업 데이터
  const subTasks = [
    { id: 1, title: '하위 루틴 1' },
    { id: 2, title: '하위 루틴 2' },
  ];

  // 더미 체크 카드 데이터
  const checkTasks = [
    { id: 1, label: '트렌드 코리아 2024' },
    { id: 2, label: '트렌드 코리아 2024' },
  ];

  // 루틴 리스트 더미 데이터
  const routineList = [
    { id: 1, title: '책 읽기', time: '5:30 오후', duration: '15분' },
    { id: 2, title: '책 읽기', time: '5:30 오후', duration: '15분' },
  ];

  return (
    <View className="flex-1 items-center bg-white">
      {/* 상단 달력 */}
      <View className="mb-4 mt-4 w-full px-4">
        <Calendar selectedDate={selectedDate} onChange={setSelectedDate} />
      </View>
      {/* 루틴 리스트 카드 예시 */}
      <View className="mb-4 w-full max-w-xs">
        {routineList.map((routine) => (
          <RoutineListCard
            key={routine.id}
            title={routine.title}
            time={routine.time}
            duration={routine.duration}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </View>
      {/* 테스트 코드 시작 */}
      <View className="mb-4 flex-row items-center gap-2">
        <Label>공통 라벨 예시</Label>
        <Button title="모달 열기" onPress={() => setModalVisible(true)} />
        <Button title="반복 안내 보기" onPress={() => setRepeatInfoVisible(true)} />
      </View>
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text className="mb-2 text-lg font-bold">공통 모달 예시</Text>
        <Text>이곳에 원하는 내용을 넣을 수 있습니다.</Text>
      </Modal>
      {/* 테스트 코드 끝 */}
      {/* 하위 작업 카드 예시 */}
      <View className="mb-4 w-full max-w-xs">
        {subTasks.map((task) => (
          <SubRoutineTaskCard key={task.id} title={task.title} className="mb-2" />
        ))}
      </View>
      {/* 반복 안내 모달 버튼 */}
      <RepeatInfoModal visible={repeatInfoVisible} onClose={() => setRepeatInfoVisible(false)} />
      {/* 알람/시간 선택 예시 */}
      <View className="mb-4 w-full max-w-xs">
        <AlarmTimePicker value={alarmTime} onChange={setAlarmTime} />
      </View>
      {/* 루틴 상세 하위 작업 체크 카드 예시 */}
      <View className="mb-4 w-full max-w-xs">
        {checkTasks.map((task, idx) => (
          <SubRoutineTaskCheckCard
            key={task.id}
            label={task.label}
            checked={taskChecks[idx]}
            onToggle={(checked) => {
              setTaskChecks((prev) => prev.map((v, i) => (i === idx ? checked : v)));
            }}
          />
        ))}
      </View>
      <AddButton onPress={() => router.push('/routine/routineform')} />
    </View>
  );
};

export default RoutineMain;
