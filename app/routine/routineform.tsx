import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

const RoutineForm = () => {
  const router = useRouter();
  const [name, setName] = React.useState('');

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="mb-4 text-xl">루틴 생성/수정</Text>
      <TextInput
        placeholder="루틴 이름"
        value={name}
        onChangeText={setName}
        className="border-gray-300 mb-4 w-48 rounded border p-2"
      />
      <Button title="저장" onPress={() => router.back()} />
    </View>
  );
};

export default RoutineForm;
