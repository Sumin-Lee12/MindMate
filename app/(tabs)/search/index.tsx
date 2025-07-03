import { Text, TouchableOpacity, View } from 'react-native';
import SearchInput from '../../../src/components/ui/search-input';
import SearchCategoryButton from '../../../src/features/search/components/search-category-button';
import SearchItemCard from '../../../src/features/search/components/search-item-card';
import { searchCategories } from '../../../src/features/search/constants/search-category-constants';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();

  const handleCreateItem = () => {
    router.push('/(tabs)/search/search-form');
  };

  return (
    //홈화면
    <View className="items-center justify-center bg-turquoise p-4">
      <View className="mb-4 w-full">
        <SearchInput />
      </View>

      <View className="mb-8 w-full flex-row justify-between">
        {searchCategories.map((category, index) => (
          <SearchCategoryButton key={index} label={category.label} />
        ))}
      </View>

      {/**Todo
       * 추후 저장된 데이터를 이용하여 목록 보여주기
       */}
      <View className="w-full gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SearchItemCard id={String(index)} key={index} />
        ))}
      </View>

      <TouchableOpacity
        className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-paleCobalt"
        onPress={() => handleCreateItem()}
      >
        <Text className="text-5xl font-light text-white">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
