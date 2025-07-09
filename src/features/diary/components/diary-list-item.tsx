import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';

type DiaryListItemProps = {
  item: any;
  onPress: () => void;
  formatDateTime: (datetime: string) => string;
};

/**
 * 일기 목록 아이템 컴포넌트
 */
const DiaryListItem = ({ item, onPress, formatDateTime }: DiaryListItemProps) => {
  const date = new Date(item.created_at ?? '');
  const day = date.getDate();
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  const formatted = formatDateTime(item.created_at ?? '');

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 flex-row overflow-hidden rounded-2xl bg-white shadow-md"
    >
      {/* 날짜 */}
      <View className="w-12 items-center justify-center bg-paleYellow">
        <Text className="text-md font-bold leading-none text-paleCobalt">{day}</Text>
        <Text className="mt-1 text-md font-bold leading-none text-paleCobalt">{weekday}</Text>
      </View>

      {/* 콘텐츠 */}
      <View className="flex-1 justify-between p-4">
        <View className="flex-row items-start justify-between">
          <View className="mr-3 flex-1">
            <Text className="text-lg font-bold leading-tight text-black">{item.title}</Text>
          </View>
          {item.thumbnailUri ? (
            <Image
              source={{ uri: item.thumbnailUri }}
              className="h-20 w-20 rounded-md"
              resizeMode="cover"
            />
          ) : (
            // 대체이미지: 배경색 + 첫글자 텍스트
            <View className="h-20 w-20 items-center justify-center rounded-md bg-paleCobalt">
              <Text className="text-2xl font-bold text-white">
                {item.title?.[0]?.toUpperCase() ?? 'D'}
              </Text>
            </View>
          )}
        </View>
        <Text className="mt-2 text-sm text-paleCobalt">{formatted}</Text>
      </View>
    </Pressable>
  );
};

export { DiaryListItem };
