import { View } from 'react-native';
import SearchInput from '../../../src/components/ui/search-input';
import SearchCategoryButton from '../../../src/features/search/components/search-category-button';
import SearchItemCard from '../../../src/features/search/components/search-item-card';
import { searchCategories } from '../../../src/features/search/constants/search-category-constants';

export default function HomeScreen() {
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

      <View className="w-full gap-4">
        <SearchItemCard id="1" />
        <SearchItemCard id="2" />
        <SearchItemCard id="3" />
        <SearchItemCard id="4" />
      </View>
    </View>
  );
}
