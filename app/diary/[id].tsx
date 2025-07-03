import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

const DiaryDetailPage = () => {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="mb-4 text-2xl font-bold">📓 일기 상세</Text>
      <Text className="text-gray-600 mb-2">ID: {id}</Text>

      <Text className="mb-6 text-base">여기에 일기 내용을 불러와서 표시합니다.</Text>

      <Pressable
        onPress={() => router.push('/diary/create')}
        className="mb-3 rounded-xl bg-yellow-500 p-4"
      >
        <Text className="text-center font-bold text-white">✏️ 수정하기</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} className="border-gray-300 rounded-xl border p-3">
        <Text className="text-gray-700 text-center">← 돌아가기</Text>
      </Pressable>
    </View>
  );
};

export default DiaryDetailPage;
