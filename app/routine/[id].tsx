import React from 'react';
import { View, Text, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const RoutineDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">루틴 상세 페이지</Text>
      <Text className="my-4">루틴 ID: {id}</Text>
      <Button title="뒤로가기" onPress={() => router.back()} />
    </View>
  );
};

export default RoutineDetail;
