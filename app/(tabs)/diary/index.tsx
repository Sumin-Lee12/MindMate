import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react-native';
import { DiaryService } from '../../../src/features/diary/services';
import { DiaryListItem } from '../../../src/features/diary/components/diary-list-item';
import { formatDateTimeString } from '../../../src/lib/date-utils';
import { groupDiariesByPeriod } from '../../../src/features/diary/utils/diary-grouping';

type SortOrderType = 'asc' | 'desc';

const DiaryListPage = () => {
  const [diaries, setDiaries] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrderType>('desc');

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const result = await DiaryService.getAllDiariesWithMedia();
      setDiaries(result);
    } catch (err) {
      console.error('일기 불러오기 실패', err);
    }
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  // 썸네일 URI 설정 (DiaryService에서 이미 우선순위가 적용됨: 이미지 > 동영상)
  const diariesWithThumbnail = diaries.map((item) => ({
    ...item,
    thumbnailUri: item.media_uri, // 이미 우선순위가 적용된 미디어 URI
  }));

  // 정렬 (수정 시간 우선, 없으면 생성 시간)
  const sortedDiaries = [...diariesWithThumbnail].sort((a, b) => {
    const dateA = new Date(a.updated_at ?? a.created_at ?? '').getTime();
    const dateB = new Date(b.updated_at ?? b.created_at ?? '').getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // 그룹화
  const grouped = groupDiariesByPeriod(sortedDiaries);

  return (
    <View className="flex-1 bg-turquoise">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 96 }}
      >
        {/* 정렬 */}
        <View className="flex-row justify-end">
          <Pressable onPress={handleSortToggle} className="flex-row items-center gap-1">
            <Text className="text-sm font-bold text-paleCobalt">
              {sortOrder === 'desc' ? '최신순' : '오래된순'}
            </Text>
            {sortOrder === 'desc' ? (
              <ArrowDownWideNarrow color={'#576bcd'} size={18} />
            ) : (
              <ArrowUpWideNarrow color={'#576bcd'} size={18} />
            )}
          </Pressable>
        </View>

        {/* 섹션별 목록 */}
        {Object.keys(grouped).map((section) => (
          <View key={section} className="mb-6">
            <View className="mb-3 flex-row items-center gap-2">
              <Feather name="calendar" size={18} color="#576bcd" />
              <Text className="text-sm font-bold text-paleCobalt">{section}</Text>
            </View>
            {grouped[section].map((item: any) => (
              <DiaryListItem
                key={item.id}
                item={item}
                onPress={() => router.push(`/diary/${item.id}`)}
                formatDateTime={formatDateTimeString}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* + 버튼 */}
      <Pressable
        onPress={() => router.push('/diary/create')}
        className="absolute bottom-16 right-6 h-16 w-16 items-center justify-center rounded-full bg-paleCobalt shadow-md"
      >
        <AntDesign name="plus" size={36} color="white" />
      </Pressable>
    </View>
  );
};

export default DiaryListPage;
