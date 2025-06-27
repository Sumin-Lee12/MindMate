import { View } from 'react-native';
import SearchInput from '@components/ui/search-input';
import SearchCategoryButton from '@features/search/components/search-category-button';
import SearchItemCard from '@features/search/components/search-item-card';
import { searchCategories } from '@features/search/constants/search-category-constants';

const HomeScreen = () => {
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
    </View>
  );
};

export default HomeScreen;
