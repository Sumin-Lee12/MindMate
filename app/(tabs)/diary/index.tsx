import { View, Text, Image, Pressable } from 'react-native';
import { FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const formatDateTime = (datetime: string) => {
  const date = new Date(datetime);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}) ${date.getHours()}시 ${date.getMinutes()}분`;
};

const thisWeekDiaries = [
  {
    id: '1',
    title: '이번 주 일기 1',
    image: 'https://picsum.photos/101',
    date: '2025-06-06T17:00:00',
  },
  {
    id: '2',
    title: '이번 주 일기 2',
    image: 'https://picsum.photos/102',
    date: '2025-06-07T10:30:00',
  },
];

const lastMonthDiaries = [
  {
    id: '3',
    title: '지난달 일기 1',
    image: 'https://picsum.photos/103',
    date: '2025-05-28T09:00:00',
  },
];

const DiaryListPage = () => {
  const renderDiaryItem = (item: any) => {
    const date = new Date(item.date);
    const day = date.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    const formatted = formatDateTime(item.date);

    return (
      <Pressable
        key={item.id}
        onPress={() => router.push(`/diary/${item.id}`)}
        className="mb-4 flex-row items-center px-2"
      >
        {/* 왼쪽 요일/날짜 */}
        <View className="w-1/6 items-center">
          <Text className="text-gray-500 text-sm">{day}</Text>
          <Text className="text-gray-500 text-sm">{weekday}</Text>
        </View>
        {/* 오른쪽 콘텐츠 */}
        <View className="bg-gray-100 flex-1 flex-row items-center rounded-xl px-4 py-3">
          <View className="flex-1 pr-3">
            <Text className="text-gray-800 text-base font-semibold">{item.title}</Text>
            <Text className="text-gray-500 mt-1 text-xs">{formatted}</Text>
          </View>
          <Image source={{ uri: item.image }} className="h-16 w-16 rounded-md" resizeMode="cover" />
        </View>
      </Pressable>
    );
  };

  return (
    <View className="relative flex-1 bg-white px-4 pt-6">
      {/* 정렬 버튼 - 상단 고정 */}
      <View className="mb-4 flex-row items-center justify-end">
        <Pressable onPress={() => console.log('정렬 클릭')} className="flex-row items-center gap-1">
          <Text className="text-gray-600 text-sm">정렬</Text>
          <FontAwesome name="sort" size={16} color="#666" />
        </Pressable>
      </View>

      {/* 지난주 구분 */}
      <View className="mb-2 flex-row items-center gap-2">
        <Feather name="calendar" size={20} color="#555" />
        <Text className="text-xs font-bold text-paleCobalt">지난주</Text>
      </View>

      {thisWeekDiaries.map(renderDiaryItem)}

      {/* 지난달 구분 */}
      <View className="mb-2 mt-6 flex-row items-center gap-2">
        <Feather name="calendar" size={20} color="#555" />
        <Text className="text-xs font-bold text-paleCobalt">지난달</Text>
      </View>

      {lastMonthDiaries.map(renderDiaryItem)}

      {/* + 버튼 */}
      <Pressable
        onPress={() => router.push('/diary/create')}
        className="absolute bottom-16 right-6 rounded-full bg-blue-500 p-4 shadow-md"
      >
        <AntDesign name="plus" size={36} color="white" />
      </Pressable>
    </View>
  );
};

export default DiaryListPage;
