import { Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import DevDbShareButton from '../src/lib/db/dev-db-share-button';

export default function HomeScreen() {
  const menuItems = [
    { title: '주소록', route: '/(tabs)/address-book', icon: '📞', color: 'bg-blue-500' },
    { title: '일기', route: '/(tabs)/diary', icon: '📔', color: 'bg-green-500' },
    { title: '루틴', route: '/(tabs)/routine', icon: '📅', color: 'bg-purple-500' },
    { title: '일정', route: '/(tabs)/schedule', icon: '⏰', color: 'bg-orange-500' },
    { title: '검색', route: '/(tabs)/search', icon: '🔍', color: 'bg-red-500' },
  ];

  const handlePress = (route: string) => {
    router.push(route);
  };

  return (
    <View className="bg-gray-100 flex-1 p-6">
      <Text className="mb-8 mt-12 text-center text-3xl font-bold">작업용홈화면</Text>
      <DevDbShareButton />
      <View className="flex-row flex-wrap justify-between">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`h-32 w-[45%] ${item.color} mb-4 items-center justify-center rounded-lg shadow-lg`}
            onPress={() => handlePress(item.route)}
          >
            <Text className="mb-2 text-4xl">{item.icon}</Text>
            <Text className="text-lg font-bold text-white">{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
