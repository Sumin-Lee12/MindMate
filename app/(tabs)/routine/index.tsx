import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

const RoutineMain = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">루틴 메인 페이지</Text>
      <Button title="루틴 생성" onPress={() => router.push('/routine/routineform')} />
      {/* 루틴 리스트 등 추가 예정 */}
    </View>
  );
};

export default RoutineMain;
