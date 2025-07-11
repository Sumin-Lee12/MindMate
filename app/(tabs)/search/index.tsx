import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SearchInput from '@/src/components/ui/search-input';
import SearchCategoryButton from '@/src/features/search/components/search-category-button';
import SearchItemCard from '@/src/features/search/components/search-item-card';
import { searchCategories } from '@/src/features/search/constants/search-category-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState, useEffect } from 'react';
import { db } from '@/src/hooks/use-initialize-database';
import { SearchData } from '@/src/features/search/db/search-db-types';
import { Package } from 'lucide-react-native';
import Button from '@/src/components/ui/button';

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
        <SearchInput
          value={search}
          onChange={setSearch}
          onSubmitEditing={filterItems}
          placeholder="검색어를 입력해주세요"
        />
      </View>

      <View className="mb-8 w-full flex-row justify-between">
        {searchCategories.map((category, index) => {
          return (
            <View
              className={`flex bg-${category.color} items-center justify-center rounded-xl px-3 py-2`}
              key={index}
            >
              <SearchCategoryButton label={category.label} onPress={filterByCategory} />
              <Text>{category.label}</Text>
            </View>
          );
        })}
      </View>

      <ScrollView className="w-full">
        {filteredItems.length === 0 && (
          <View className="top-1/2 flex items-center justify-center">
            <View className="mb-3 flex">
              <Package size={48} />
            </View>
            <Text className="mb-2 flex text-md">아직 등록된 물건이 없어요</Text>
            <Text className="mb-3 flex text-sm">첫 번재 물건을 등록해보세요</Text>
            <Button onPress={handleCreateItem} className="w-3/5">
              <Text className="text-white">물건 등록하기</Text>
            </Button>
          </View>
        )}
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
