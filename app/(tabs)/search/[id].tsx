import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Button from '../../../src/components/ui/button';
import { db } from '@/src/hooks/use-initialize-database';
import { useCallback, useState } from 'react';
import { SearchData } from '@/src/features/search/db/search-db-types';
import { MediaFullType } from '@/src/lib/db/share-db-types';

const ItemDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [items, setItems] = useState<SearchData | null>(null);
  const [media, setMedia] = useState<MediaFullType[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchGetSearch();
      fetchGetMedia();
    }, []),
  );

  const fetchGetSearch = async () => {
    try {
      const search = (await db.getFirstAsync(`
        SELECT * FROM search WHERE id = ${id}
      `)) as SearchData;
      setItems(search);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGetMedia = async () => {
    try {
      const media = (await db.getAllAsync(`
        SELECT * FROM media WHERE owner_type = 'search' AND owner_id = ${id}
      `)) as MediaFullType[];
      setMedia(media);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 justify-around bg-turquoise px-4">
      <View className="top-[-20px]">
        <View className="mb-12 w-full flex-row items-center">
          <Text className=" mr-4 text-xl font-bold">{items?.name}</Text>
          <View className="h-8 w-24 items-center justify-center rounded-full bg-foggyBlue text-center ">
            <Text className="text-ss">{items?.category}</Text>
          </View>
        </View>

        <View className="flex-1/3 mb-6 h-[200px] w-full items-center justify-center rounded-xl bg-foggyBlue">
          <Text>사진</Text>
        </View>

        <View className="flex-1/3 h-[200px] w-full rounded-xl bg-white p-4 shadow-dropShadow">
          <Text className="mb-6 text-sm font-bold color-foggyBlue">상세 위치</Text>
          <Text className=" text-md">{items?.description}</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <Button className="w-2/3" onPress={() => console.log(`Item ID: ${id}`)}>
          <Text className="text-lg text-white">수정하기</Text>
        </Button>
        <Button
          className="w-1/4 bg-paleYellow"
          onPress={() => console.log(`Delete Item ID: ${id}`)}
        >
          <Text className="text-lg text-black">삭제</Text>
        </Button>
      </View>
    </View>
  );
};

export default ItemDetailScreen;
