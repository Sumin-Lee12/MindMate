import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SearchInput from '@/src/components/ui/search-input';
import SearchCategoryButton from '@/src/features/search/components/search-category-button';
import SearchItemCard from '@/src/features/search/components/search-item-card';
import { searchCategories } from '@/src/features/search/constants/search-category-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { db } from '@/src/hooks/use-initialize-database';
import { SearchData } from '@/src/features/search/db/search-db-types';
import Button from '@/src/components/ui/button';

const HomeScreen = () => {
  const [items, setItems] = useState<SearchData[]>([]);
  const router = useRouter();

  const handleCreateItem = () => {
    router.push('/(tabs)/search/search-form');
  };

  useFocusEffect(
    useCallback(() => {
      getSearchItems();
    }, []),
  );

  const getSearchItems = async () => {
    const items = (await db.getAllAsync(`SELECT * FROM search`)) as SearchData[];
    const data = await db.getAllAsync(`SELECT * FROM media`);
    console.log(data);
    setItems(items);
    // console.log('Search items:', items);
  };

  const resetTable = async () => {
    await db.runAsync(`
      DELETE FROM search
    `);
    await db.runAsync(`
      DELETE FROM media
    `);
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
      <Button onPress={resetTable}>
        <Text>초기화</Text>
      </Button>
      <ScrollView className="w-full">
        <View className="w-full gap-4">
          {items.map((item) => (
            <SearchItemCard
              key={item.id}
              id={item.id}
              category={item.category}
              name={item.name}
              location={item.location}
            />
          ))}
        </View>
      </ScrollView>

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
