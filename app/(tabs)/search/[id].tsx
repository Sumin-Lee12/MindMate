import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Button from '../../../src/components/ui/button';

const ItemDetailScreen = () => {
  const { id } = useLocalSearchParams();
  return (
    <View className="flex-1 bg-turquoise p-4">
      <View className="mb-12 w-full flex-row items-center">
        <Text className=" mr-4 text-xl font-bold">열쇠</Text>
        <View className="h-8 w-24 items-center justify-center rounded-full bg-foggyBlue text-center ">
          <Text className="text-ss">개인용품</Text>
        </View>
      </View>

      <View className="flex-1/3 mb-6 h-[200px] w-full items-center justify-center rounded-xl bg-foggyBlue">
        <Text>사진</Text>
      </View>

      <View className="flex-1/3 h-[200px] w-full rounded-xl bg-white p-4">
        <Text className="mb-6 text-sm font-bold color-foggyBlue">상세 위치</Text>
        <Text className=" text-md">
          현관문 바로 옆 신발장 위, 자주 쓰는 회색 바구니 안에 있어요
        </Text>
      </View>

      <View></View>
    </View>
  );
};

export default ItemDetailScreen;
