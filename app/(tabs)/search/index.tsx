import { Text,  View } from 'react-native';
import SearchInput from '../../../src/components/ui/search-input';
import CommonBox from '../../../src/components/ui/common-box';
import SearchCategoryButton from '../../../src/features/search/components/search-category-button';

const searchCategories = [
  { icon: '🗝️', label: '개인용품', color: 'foggyBlue' },
  { icon: '📱', label: '모바일', color: 'paleYellow' },
  { icon: '💻', label: '전자제품', color: 'pink' },
  { icon: '☕', label: '주방용품', color: 'teal' },
];

export default function HomeScreen() {
  return (
    //홈화면
    <View className="items-center justify-center bg-turquoise p-4">
      <SearchInput />
      <View className="w-full flex-row justify-between">
        {searchCategories.map((category, index) => (
          <SearchCategoryButton key={index} category={category} />
        ))}
      </View>
      <View className="w-full">
        <CommonBox>
          <Text className="text-lg font-bold text-paleCobalt">추천 검색어</Text>
        </CommonBox>
      </View>
    </View>
  );
}
