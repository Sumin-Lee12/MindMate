import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FlatList, Image, Text, useWindowDimensions, View } from 'react-native';
import Button from '../../../src/components/ui/button';
import { db } from '@/src/hooks/use-initialize-database';
import { useCallback, useState } from 'react';
import { SearchData } from '@/src/features/search/db/search-db-types';
import { MediaFullType } from '@/src/lib/db/share-db-types';
import { getCategoryData } from '@/src/features/search/utils/getCategoryData';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react-native';

const ItemDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [items, setItems] = useState<SearchData | null>(null);
  const [media, setMedia] = useState<MediaFullType[]>([]);
  const { width: screenWidth } = useWindowDimensions();

  const itemWidth = screenWidth - 28;

  useFocusEffect(
    useCallback(() => {
      fetchGetSearch();
      fetchGetMedia();
    }, []),
  );

  // GetSearch 로직
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

  // GetMedia 로직
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

  // 삭제 로직
  const fetchDeleteSearch = async () => {
    try {
      await db.execAsync(`
        DELETE FROM search WHERE id = ${id};
        DELETE FROM media WHERE owner_type = 'search' AND owner_id = ${id}
      `);
      // todo : toast alert가 있으면 좋을 듯
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  if (items === null)
    return (
      <View className="flex-1 bg-turquoise px-4 py-8">
        <Text>로딩중...</Text>
      </View>
    );

  const { color } = getCategoryData(items.category);
  return (
    <View className="flex-1 justify-between bg-turquoise px-4 py-8">
      <View className="flex">
        <View className="mb-12 w-full flex-row items-center">
          <Text className=" mr-4 text-xl font-bold">{items.name}</Text>
          <View
            className={`h-8 w-24 items-center justify-center rounded-full bg-${color} text-center`}
          >
            <Text className="text-ss">{items.category}</Text>
          </View>
        </View>

        <View className="mb-6">
          <View className="absolute left-4 top-1/2 z-10 items-center justify-center rounded-full bg-paleCobalt">
            <ChevronLeft color="white" />
          </View>
          <View className=" absolute right-4 top-1/2 z-10 items-center justify-center rounded-full bg-paleCobalt">
            <ChevronRight color="white" />
          </View>
          {media.length > 0 && (
            <FlatList
              data={media}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={itemWidth}
              decelerationRate="fast"
              renderItem={({ item }) => (
                <View
                  style={{ width: itemWidth }}
                  className={`h-[200px] items-center justify-center rounded-xl`}
                >
                  <Image
                    source={{ uri: item.file_path }}
                    resizeMode="cover"
                    className="h-full w-full rounded-xl"
                  />
                </View>
              )}
            />
          )}
        </View>

        <View className="flex-row gap-3">
          <MapPin size={18} color="#576bcd" />
          <Text className="mb-6 text-sm font-bold color-foggyBlue">{items.location}</Text>
        </View>
        <View className="flex-1/3 h-[168px] w-full rounded-xl bg-white p-6 shadow-dropShadow">
          {/* <Text className="mb-6 text-sm font-bold color-foggyBlue">상세 위치</Text> */}
          <Text className=" text-md">{items.description}</Text>
        </View>
      </View>

      <View className="flex-row justify-between gap-4">
        <Button className="w-[244px]" onPress={() => console.log(`Item ID: ${id}`)}>
          <Text className="text-lg text-white">수정하기</Text>
        </Button>
        <Button className="flex-1 bg-paleYellow" onPress={fetchDeleteSearch}>
          <Text className="text-lg text-black">삭제</Text>
        </Button>
      </View>
    </View>
  );
};

export default ItemDetailScreen;
