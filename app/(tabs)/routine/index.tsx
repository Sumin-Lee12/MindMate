import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import AddButton from 'src/components/ui/add-button';
import CheckBox from 'src/components/ui/checkbox';
import Label from 'src/components/ui/label';
import Modal from 'src/components/ui/modal';
import Calendar from 'src/components/ui/calendar';
import { useRouter } from 'expo-router';

const RoutineMain = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View className="justify-top flex-1 items-center bg-white">
      {/* 상단 달력 */}
      <View className="mb-6 mt-4 w-full px-4">
        <Calendar selectedDate={selectedDate} onChange={setSelectedDate} />
      </View>
      {/* 테스트 코드 시작 */}
      <Label className="mb-4">공통 라벨 예시</Label>
      <View className="mb-4 flex-row items-center">
        <CheckBox checked={checked} onChange={setChecked} className="mr-2" />
        <Text>체크박스 예시 ({checked ? '체크됨' : '해제됨'})</Text>
      </View>
      <Button title="모달 열기" onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text className="mb-2 text-lg font-bold">공통 모달 예시</Text>
        <Text>이곳에 원하는 내용을 넣을 수 있습니다.</Text>
      </Modal>
      {/* 테스트 코드 끝 */}
      <AddButton onPress={() => router.push('/routine/routineform')} />
    </View>
  );
};

export default RoutineMain;
