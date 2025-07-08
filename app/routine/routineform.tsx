import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SubRoutineTaskCheckCard from 'src/features/routine/components/SubRoutineTaskCheckCard';
import Label from 'src/components/ui/label';

// 더미 루틴 데이터 (실제로는 서버에서 가져올 데이터)
// TODO: 서버 연동 후 실제 데이터로 교체
const getRoutineData = (id: string) => {
  const routines = {
    '1': {
      id: 1,
      title: '책 읽기',
      description: '매일 독서 습관을 기르기 위한 루틴입니다.',
      date: '2025년 6월 5일',
      repeat: '매일',
      time: '5:30 PM',
      duration: '15분',
      image: null,
      subTasks: [
        { id: 1, title: '트렌드 코리아 2024', completed: false },
        { id: 2, title: '트렌드 코리아 2024', completed: true },
        { id: 3, title: '트렌드 코리아 2024', completed: false },
      ],
    },
    '2': {
      id: 2,
      title: '운동하기',
      description: '규칙적인 운동 습관을 기르기 위한 루틴입니다.',
      date: '2025년 6월 5일',
      repeat: '매주 월,수,금',
      time: '6:00 PM',
      duration: '30분',
      image: null,
      subTasks: [
        { id: 1, title: '스트레칭', completed: true },
        { id: 2, title: '유산소 운동', completed: false },
        { id: 3, title: '근력 운동', completed: false },
      ],
    },
  };

  return routines[id as keyof typeof routines] || routines['1'];
};

const RoutineForm = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [routineData, setRoutineData] = useState<any>(null);
  const [subTaskChecks, setSubTaskChecks] = useState<boolean[]>([]);

  useEffect(() => {
    if (id) {
      const data = getRoutineData(id as string);
      setRoutineData(data);
      setSubTaskChecks(data.subTasks.map((task: any) => task.completed));
    }
  }, [id]);

  // 하위 작업 체크 상태 변경
  const handleSubTaskToggle = (index: number, checked: boolean) => {
    const newChecks = [...subTaskChecks];
    newChecks[index] = checked;
    setSubTaskChecks(newChecks);
    /* TODO: 서버에 하위 작업 완료 상태 업데이트 */
  };

  // 루틴 완료 처리
  const handleCompleteRoutine = () => {
    /* TODO: 루틴 완료 처리 로직 */
    console.log('Routine completed!');
  };

  if (!routineData) {
    return (
      <View className="flex-1 items-center justify-center bg-turquoise">
        <Text className="text-lg text-gray">로딩 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-turquoise">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between bg-white px-4 py-3 shadow-sm">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#576BCD" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">루틴 상세</Text>
        <TouchableOpacity onPress={() => router.push(`/routine/${routineData.id}`)}>
          <Ionicons name="create-outline" size={24} color="#576BCD" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* 루틴 기본 정보 */}
        <View className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <View className="mb-4 flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="mb-2 text-xl font-bold text-black">{routineData.title}</Text>
              <Text className="text-sm text-gray">{routineData.description}</Text>
            </View>
            {routineData.image && (
              <Image
                source={{ uri: routineData.image }}
                className="ml-4 h-16 w-16 rounded-lg"
                resizeMode="cover"
              />
            )}
          </View>

          {/* 루틴 정보 라벨들 */}
          <View className="flex-row flex-wrap gap-2">
            <Label>{routineData.date}</Label>
            <Label>{routineData.repeat}</Label>
            <Label>{routineData.time}</Label>
            <Label>{routineData.duration}</Label>
          </View>
        </View>

        {/* 하위 작업 섹션 */}
        <View className="mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-black">하위 작업</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-gray">
                {subTaskChecks.filter(Boolean).length}/{subTaskChecks.length}
              </Text>
              <View className="h-2 w-16 rounded-full bg-foggyBlue">
                <View
                  className="h-2 rounded-full bg-paleCobalt"
                  style={{
                    width: `${(subTaskChecks.filter(Boolean).length / subTaskChecks.length) * 100}%`,
                  }}
                />
              </View>
            </View>
          </View>

          {/* 하위 작업 리스트 */}
          <View className="space-y-2">
            {routineData.subTasks.map((task: any, index: number) => (
              <SubRoutineTaskCheckCard
                key={task.id}
                label={task.title}
                checked={subTaskChecks[index]}
                onToggle={(checked) => handleSubTaskToggle(index, checked)}
              />
            ))}
          </View>
        </View>

        {/* 루틴 완료 버튼 */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={handleCompleteRoutine}
            className={`rounded-xl py-4 ${
              subTaskChecks.every(Boolean) ? 'bg-paleCobalt' : 'bg-foggyBlue'
            }`}
            disabled={!subTaskChecks.every(Boolean)}
          >
            <Text
              className={`text-center font-bold ${
                subTaskChecks.every(Boolean) ? 'text-white' : 'text-gray'
              }`}
            >
              {subTaskChecks.every(Boolean) ? '루틴 완료!' : '모든 하위 작업을 완료해주세요'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 추가 액션 버튼들 */}
        <View className="mb-6 space-y-3">
          <TouchableOpacity
            onPress={() => {
              /* TODO: 루틴 공유 */
            }}
            className="flex-row items-center justify-center rounded-xl bg-white py-3 shadow-sm"
          >
            <Ionicons name="share-outline" size={20} color="#576BCD" />
            <Text className="ml-2 font-medium text-paleCobalt">루틴 공유</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              /* TODO: 루틴 통계 보기 */
            }}
            className="flex-row items-center justify-center rounded-xl bg-white py-3 shadow-sm"
          >
            <Ionicons name="analytics-outline" size={20} color="#576BCD" />
            <Text className="ml-2 font-medium text-paleCobalt">통계 보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RoutineForm;
