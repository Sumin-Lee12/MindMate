import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ArrowDownWideNarrow } from 'lucide-react-native';

const formatDateTime = (datetime: string) => {
  const date = new Date(datetime);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}요일  오후 ${hours}:${minutes}`;
};

const diaryData = [
  {
    id: '1',
    title: 'React Native\n프로젝트 시작',
    image: 'https://picsum.photos/100',
    date: '2025-06-06T17:00:00',
    section: '지난 주',
  },
  {
    id: '2',
    title: 'React Native\n프로젝트 시작',
    image: 'https://picsum.photos/101',
    date: '2025-06-06T17:00:00',
    section: '지난 주',
  },
  {
    id: '3',
    title: 'React Native\n프로젝트 시작',
    image: 'https://picsum.photos/102',
    date: '2025-06-06T17:00:00',
    section: '지난 달',
  },
];

const DiaryListPage = () => {
  const grouped = diaryData.reduce((acc: any, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const renderDiaryItem = (item: any) => {
    const date = new Date(item.date);
    const day = date.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    const formatted = formatDateTime(item.date);

    return (
      <Pressable
        key={item.id}
        onPress={() => router.push(`/diary/${item.id}`)}
        className="mb-4 flex-row overflow-hidden rounded-2xl bg-white shadow-md"
      >
        {/* 날짜 - 카드 전체 높이를 꽉 채움 */}
        <View className="w-12 items-center justify-center bg-paleYellow">
          <Text className="text-md font-bold leading-none text-paleCobalt">{day}</Text>
          <Text className="mt-1 text-md font-bold leading-none text-paleCobalt">{weekday}</Text>
        </View>

        {/* 콘텐츠 영역 */}
        <View className="flex-1 justify-between p-4">
          {/* 제목과 이미지 */}
          <View className="flex-row items-start justify-between">
            <View className="mr-3 flex-1">
              <Text className="text-lg font-bold leading-tight text-black">{item.title}</Text>
            </View>
            <Image
              source={{ uri: item.image }}
              className="h-20 w-20 rounded-md"
              resizeMode="cover"
            />
          </View>

          {/* 날짜 */}
          <Text className="mt-2 text-sm text-paleCobalt">{formatted}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-turquoise">
      background: ;
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 96 }}
      >
        {/* 정렬 */}
        <View className="mb-4 flex-row justify-end">
          <Pressable
            onPress={() => console.log('정렬 클릭')}
            className="flex-row items-center gap-1"
          >
            <Text className="leading-[normal]; text-sm font-bold not-italic text-paleCobalt">
              정렬
            </Text>
            <ArrowDownWideNarrow color={'#576bcd'} size={'18px'} />
          </Pressable>
        </View>

        {/* 섹션 */}
        {Object.keys(grouped).map((section) => (
          <View key={section} className="mb-6">
            <View className="mb-3 flex-row items-center gap-2">
              <Feather name="calendar" width={18} height={20} size={18} color="#576bcd" />
              <Text className="text-sm font-bold text-paleCobalt">{section}</Text>
            </View>
            {grouped[section].map(renderDiaryItem)}
          </View>
        ))}
      </ScrollView>
      {/* 플로팅 + 버튼 */}
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
