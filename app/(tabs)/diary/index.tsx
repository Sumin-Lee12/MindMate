import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ArrowDownWideNarrow } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { DiaryService } from '../../../src/features/diary/services';

type DiaryWithMediaType = Awaited<ReturnType<typeof DiaryService.getAllDiariesWithMedia>>;

const formatDateTime = (datetime: string) => {
  const date = new Date(datetime);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}요일  오후 ${hours}:${minutes}`;
};

const DiaryListPage = () => {
  const [diaries, setDiaries] = useState<DiaryWithMediaType>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await DiaryService.getAllDiariesWithMedia();
        setDiaries(result);
      } catch (err) {
        console.error('일기 불러오기 실패', err);
      }
    };
    fetchData();
  }, []);

  const grouped = diaries.reduce((acc: any, item) => {
    const date = new Date(item.created_at ?? '');
    const now = new Date();
    let section = '과거';

    const isSameWeek = (d1: Date, d2: Date) => {
      const oneJan = new Date(d1.getFullYear(), 0, 1);
      const week1 = Math.ceil(
        ((d1.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7,
      );
      const week2 = Math.ceil(
        ((d2.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7,
      );
      return d1.getFullYear() === d2.getFullYear() && week1 === week2;
    };

    if (isSameWeek(date, now)) section = '이번 주';
    else if (date.getMonth() === now.getMonth() - 1) section = '지난 달';
    else if (date.getMonth() === now.getMonth()) section = '이번 달';
    else section = '과거';

    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  const renderDiaryItem = (item: any) => {
    const date = new Date(item.created_at);
    const day = date.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    const formatted = formatDateTime(item.created_at);

    return (
      <Pressable
        key={item.id}
        onPress={() => router.push(`/diary/${item.id}`)}
        className="mb-4 flex-row overflow-hidden rounded-2xl bg-white shadow-md"
      >
        {/* 날짜 */}
        <View className="w-12 items-center justify-center bg-paleYellow">
          <Text className="text-md font-bold leading-none text-paleCobalt">{day}</Text>
          <Text className="mt-1 text-md font-bold leading-none text-paleCobalt">{weekday}</Text>
        </View>

        {/* 콘텐츠 */}
        <View className="flex-1 justify-between p-4">
          <View className="flex-row items-start justify-between">
            <View className="mr-3 flex-1">
              <Text className="text-lg font-bold leading-tight text-black">{item.title}</Text>
            </View>
            {item.media_uri ? (
              <Image
                source={{ uri: item.media_uri }}
                className="h-20 w-20 rounded-md"
                resizeMode="cover"
              />
            ) : null}
          </View>
          <Text className="mt-2 text-sm text-paleCobalt">{formatted}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-turquoise">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 96 }}
      >
        {/* 정렬 */}
        <View className="mb-4 flex-row justify-end">
          <Pressable
            onPress={() => console.log('정렬 클릭')}
            className="flex-row items-center gap-1"
          >
            <Text className="text-sm font-bold text-paleCobalt">정렬</Text>
            <ArrowDownWideNarrow color={'#576bcd'} size={18} />
          </Pressable>
        </View>

        {/* 섹션 */}
        {Object.keys(grouped).map((section) => (
          <View key={section} className="mb-6">
            <View className="mb-3 flex-row items-center gap-2">
              <Feather name="calendar" size={18} color="#576bcd" />
              <Text className="text-sm font-bold text-paleCobalt">{section}</Text>
            </View>
            {grouped[section].map(renderDiaryItem)}
          </View>
        ))}
      </ScrollView>

      {/* + 버튼 */}
      <Pressable
        onPress={() => router.push('/diary/create')}
        className="absolute bottom-16 right-6 h-16 w-16 items-center justify-center rounded-full bg-paleCobalt shadow-md"
      >
        <AntDesign name="plus" size={36} color="white" />
      </Pressable>
    </View>
  );
};

export default DiaryListPage;
