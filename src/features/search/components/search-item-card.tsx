import { Text, TouchableOpacity, View } from 'react-native';
import CommonBox from '../../../components/ui/common-box';
import SearchCategoryButton from './search-category-button';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

type SearchItemCardProps = {
  id?: string;
};

const SearchItemCard = ({ id }: SearchItemCardProps) => {
  const handlePress = () => {
    router.push(`./search/${id}`);
  };

  return (
    <CommonBox color="paleCobalt">
      {/**Todo
       * 추후 id를 이용해 commonbox의 색상을 변경할 수 있도록 구현
       * 현재는 id가 없으면 기본 색상으로 설정되어 있음
       */}
      <TouchableOpacity onPress={handlePress}>
        <View className="flex-row items-center ">
          <View className="mr-4">
            <SearchCategoryButton label="개인용품" />
          </View>

          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-2">
              <Text className="text-lg font-bold ">열쇠</Text>
              <Text className="w-24 rounded-md bg-foggyBlue text-center text-ss">개인용품</Text>
            </View>
            <Text className="text-md text-gray">현관 신발장 위</Text>
          </View>

          <TouchableOpacity>
              <ChevronRight />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </CommonBox>
  );
};

export default SearchItemCard;
