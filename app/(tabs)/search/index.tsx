import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import SearchInput from '@/src/components/ui/search-input';
import SearchCategoryButton from '@/src/features/search/components/search-category-button';
import SearchItemCard from '@/src/features/search/components/search-item-card';
import { searchCategories } from '@/src/features/search/constants/search-category-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { db } from '@/src/hooks/use-initialize-database';
import { SearchData } from '@/src/features/search/db/search-db-types';
import { Package } from 'lucide-react-native';
import Button from '@/src/components/ui/button';
import { set } from 'zod';

const HomeScreen = () => {
  const [items, setItems] = useState<SearchData[]>([]); // 전체
  const [input, setInput] = useState(''); // 검색어
  // const [displayItems, setDisplayItems] = useState<SearchData[]>([]); // 화면에 보여주는 아이템
  const [search, setSearch] = useState(''); // 검색어
  const [selectCategory, setSelectCategory] = useState(''); // 선택된 카테고리
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
      setSelectCategory('전체');
    }, []),
  );

  const displayItems = useMemo(() => {
    // // 카테고리 all 에서 검색하면 전체 목록에서 검색
    // if (selectCategory === '전체' && search) {
    //   return items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    // }
    // // 카테고리가 all 이면 전체 목록
    // if (selectCategory === '전체' && !search) {
    //   return items;
    // }
    // return items.filter(
    //   // 카테고리가 선택하면 해당하는 카테고리
    //   // 카테고리 선택 후 검색 하면 카테고리에서 검색
    //   (item) =>
    //     (!selectCategory || item.category === selectCategory) &&
    //     (!search || item.name.toLowerCase().includes(search.toLowerCase())),
    // );
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      // 1) 전체(‘전체’)인 경우 항상 통과, 특정 카테고리인 경우 일치 여부 검사
      const matchesCategory = selectCategory === '전체' || item.category === selectCategory;

      // 2) search가 빈 문자열이면 항상 통과, 아니면 포함 여부 검사
      const matchesSearch = !normalizedSearch || item.name.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectCategory, search]);

  return (
    //홈화면
    <View className="flex-1 items-center justify-center bg-turquoise p-4">
      <View className="mb-4 w-full">
        <SearchInput
          value={input}
          onChange={setInput}
          onSubmitEditing={() => setSearch(input)}
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
              <SearchCategoryButton
                label={category.label}
                onPress={() => setSelectCategory(category.label)}
              />
              <Text>{category.label}</Text>
            </View>
          );
        })}
      </View>

      <ScrollView className="w-full">
        {displayItems.length === 0 && (
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
          {displayItems.map((item) => (
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
