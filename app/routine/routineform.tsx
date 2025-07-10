import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SubRoutineTaskCheckCard from 'src/features/routine/components/SubRoutineTaskCheckCard';
import Label from 'src/components/ui/label';
import { useRoutineDetailQuery } from 'src/features/routine/hooks/use-routine-query';
import {
  useUpdateRoutine,
  useUpdateSubTaskCompletion,
} from 'src/features/routine/hooks/use-routine-mutation';
import { RoutineType } from 'src/features/routine/types';

const RoutineForm = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [subTaskChecks, setSubTaskChecks] = useState<boolean[]>([]);

  // 루틴 상세 조회 훅
  const { routine, isLoading, error, refetch } = useRoutineDetailQuery(id as string);

  // 루틴 수정 훅
  const { updateRoutine, isLoading: isUpdating } = useUpdateRoutine();

  // 하위 작업 완료 상태 변경 훅
  const { updateCompletion, isLoading: isUpdatingTask } = useUpdateSubTaskCompletion();

  // 루틴 데이터가 로드되면 하위 작업 체크 상태 초기화
  useEffect(() => {
    if (routine) {
      setSubTaskChecks(routine.subTasks.map((task) => task.isCompleted));
    }
  }, [routine]);

  // 하위 작업 체크 상태 변경
  const handleSubTaskToggle = async (index: number, checked: boolean) => {
    if (!routine) return;

    const subTask = routine.subTasks[index];
    if (!subTask) return;

    const success = await updateCompletion(subTask.id, checked);
    if (success) {
      const newChecks = [...subTaskChecks];
      newChecks[index] = checked;
      setSubTaskChecks(newChecks);
      // 루틴 데이터 새로고침
      refetch();
    }
  };

  // 루틴 완료 처리
  const handleCompleteRoutine = () => {
    Alert.alert('루틴 완료', '모든 하위 작업이 완료되었습니다! 루틴을 완료 처리하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '완료',
        onPress: () => {
          // TODO: 루틴 완료 처리 로직 (루틴 실행 기록 저장)
          Alert.alert('축하합니다!', '루틴을 성공적으로 완료했습니다.');
        },
      },
    ]);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-turquoise">
        <ActivityIndicator size="large" color="#0891b2" />
        <Text className="text-gray-600 mt-4">루틴을 불러오는 중...</Text>
      </View>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-turquoise px-4">
        <Text className="mb-4 text-center text-red-500">{error}</Text>
        <TouchableOpacity className="rounded-lg bg-cyan-600 px-4 py-2" onPress={refetch}>
          <Text className="text-white">다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 루틴 데이터가 없는 경우
  if (!routine) {
    return (
      <View className="flex-1 items-center justify-center bg-turquoise">
        <Text className="text-gray-600">루틴을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  // 시간 포맷팅 함수
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  const allTasksCompleted = subTaskChecks.every(Boolean);
  const completedCount = subTaskChecks.filter(Boolean).length;
  const totalCount = subTaskChecks.length;

  return (
    <View className="flex-1 bg-turquoise">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between bg-white px-4 py-3 shadow-sm">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#576BCD" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">루틴 상세</Text>
        <TouchableOpacity onPress={() => router.push(`/routine/routineform?id=${routine.id}`)}>
          <Ionicons name="create-outline" size={24} color="#576BCD" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* 루틴 기본 정보 */}
        <View className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <View className="mb-4 flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="mb-2 text-xl font-bold text-black">{routine.name}</Text>
              <Text className="text-sm text-gray">{routine.details || '설명이 없습니다.'}</Text>
            </View>
            {routine.imageUrl && (
              <Image
                source={{ uri: routine.imageUrl }}
                className="ml-4 h-16 w-16 rounded-lg"
                resizeMode="cover"
              />
            )}
          </View>

          {/* 루틴 정보 라벨들 */}
          <View className="flex-row flex-wrap gap-2">
            {routine.deadline && <Label>{formatDate(routine.deadline)}</Label>}
            <Label>{routine.repeatCycle}</Label>
            {routine.alarmTime && <Label>{formatTime(routine.alarmTime)}</Label>}
            <Label>{routine.subTasks.length}개 작업</Label>
          </View>
        </View>

        {/* 하위 작업 섹션 */}
        <View className="mb-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-black">하위 작업</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-gray">
                {completedCount}/{totalCount}
              </Text>
              <View className="h-2 w-16 rounded-full bg-foggyBlue">
                <View
                  className="h-2 rounded-full bg-paleCobalt"
                  style={{
                    width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%',
                  }}
                />
              </View>
            </View>
          </View>

          {/* 하위 작업 리스트 */}
          <View className="space-y-2">
            {routine.subTasks.map((task, index) => (
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
            className={`rounded-xl py-4 ${allTasksCompleted ? 'bg-paleCobalt' : 'bg-foggyBlue'}`}
            disabled={!allTasksCompleted}
          >
            <Text
              className={`text-center font-bold ${allTasksCompleted ? 'text-white' : 'text-gray'}`}
            >
              {allTasksCompleted ? '루틴 완료!' : '모든 하위 작업을 완료해주세요'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 추가 액션 버튼들 */}
        <View className="mb-6 space-y-3">
          <TouchableOpacity
            onPress={() => {
              /* TODO: 루틴 공유 */
              Alert.alert('공유', '루틴 공유 기능은 준비 중입니다.');
            }}
            className="flex-row items-center justify-center rounded-xl bg-white py-3 shadow-sm"
          >
            <Ionicons name="share-outline" size={20} color="#576BCD" />
            <Text className="ml-2 font-medium text-paleCobalt">루틴 공유</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              /* TODO: 루틴 통계 보기 */
              Alert.alert('통계', '루틴 통계 기능은 준비 중입니다.');
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
