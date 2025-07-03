import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

const DiaryCreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    // 저장 로직 (SQLite/Supabase 등)
    console.log({ title, content });
    router.back(); // 저장 후 목록으로 돌아가기
  };

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="mb-4 text-2xl font-bold">📝 일기 작성</Text>

      <TextInput
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
        className="border-gray-300 mb-4 rounded-xl border p-3"
      />
      <TextInput
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={5}
        className="border-gray-300 mb-4 h-40 rounded-xl border p-3 text-start"
      />

      <Pressable onPress={handleSubmit} className="rounded-xl bg-green-500 p-4">
        <Text className="text-center font-bold text-white">저장하기</Text>
      </Pressable>
    </View>
  );
};

export default DiaryCreatePage;
