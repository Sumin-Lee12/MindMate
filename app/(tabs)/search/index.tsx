import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SearchInput from '@/src/components/ui/search-input';
import SearchCategoryButton from '@/src/features/search/components/search-category-button';
import SearchItemCard from '@/src/features/search/components/search-item-card';
import { searchCategories } from '@/src/features/search/constants/search-category-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { db } from '@/src/hooks/use-initialize-database';
import { SearchData } from '@/src/features/search/db/search-db-types';

const HomeScreen = () => {
  const [items, setItems] = useState<SearchData[]>([]);
  const [filteredItems, setFilteredItems] = useState<SearchData[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleCreateItem = () => {
    router.push('/(tabs)/search/search-form');
  };

  // search 테이블 데이터 가져오기
  const getSearchItems = async () => {
    const allItems = (await db.getAllAsync(`SELECT * FROM search`)) as SearchData[];
    setItems(allItems);
  };

  useFocusEffect(
    useCallback(() => {
      getSearchItems();
    }, []),
  );

  useEffect(() => {
    if (!search) {
      setFilteredItems(items);
    }
  }, [search, items]);

  // 검색 로직
  const filterItems = () => {
    const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredItems(filtered);
  };

  // 카테고리 필터링
  const filterByCategory = (category: string) => {
    const filtered = items.filter((item) => item.category === category);
    setFilteredItems(filtered);
  };

  return (
    //홈화면
    <View className="flex-1 items-center justify-center bg-turquoise p-4">
      <View className="mb-4 w-full">
        <SearchInput value={search} onChange={setSearch} onSubmitEditing={filterItems} />
      </View>

      <View className="mb-8 w-full flex-row justify-between">
        {searchCategories.map((category, index) => (
          <SearchCategoryButton key={index} label={category.label} onPress={filterByCategory} />
        ))}
      </View>

      <ScrollView className="w-full">
        <View className="w-full gap-4">
          {filteredItems.map((item) => (
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
