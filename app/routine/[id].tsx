import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from 'src/components/ui/checkbox';
import AlarmTimePicker from 'src/features/routine/components/AlarmTimePicker';
import RepeatInfoModal from 'src/features/routine/components/RepeatInfoModal';
import { useRoutineDetailQuery } from 'src/features/routine/hooks/use-routine-query';
import {
  useCreateRoutine,
  useUpdateRoutine,
} from 'src/features/routine/hooks/use-routine-mutation';
import {
  CreateRoutinePayload,
  UpdateRoutinePayload,
  RepeatCycleType,
} from 'src/features/routine/types';

const RoutineDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = id !== 'new';

  // 상태 관리
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subTasks, setSubTasks] = useState(['']);
  const [repeatInfo, setRepeatInfo] = useState<RepeatCycleType>('매일');
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [imageUrl, setImageUrl] = useState('');
  const [showRepeatInfo, setShowRepeatInfo] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // 루틴 조회 훅 (수정 모드일 때만)
  const { routine, isLoading, error } = useRoutineDetailQuery(isEdit ? (id as string) : null);

  // 루틴 생성/수정 훅
  const { createRoutine, isLoading: isCreating } = useCreateRoutine();
  const { updateRoutine, isLoading: isUpdating } = useUpdateRoutine();

  // 기존 루틴 데이터 로드 (수정 모드)
  useEffect(() => {
    if (routine && isEdit) {
      setTitle(routine.name);
      setDescription(routine.details || '');
      setSubTasks(routine.subTasks.map((task) => task.title));
      setRepeatInfo(routine.repeatCycle);
      if (routine.alarmTime) {
        const [hours, minutes] = routine.alarmTime.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        setAlarmTime(date);
      }
      setImageUrl(routine.imageUrl || '');
    }
  }, [routine, isEdit]);

  // 하위 작업 추가
  const addSubTask = () => {
    setSubTasks([...subTasks, '']);
  };

  // 하위 작업 삭제
  const removeSubTask = (index: number) => {
    if (subTasks.length > 1) {
      setSubTasks(subTasks.filter((_, i) => i !== index));
    }
  };

  // 하위 작업 업데이트
  const updateSubTask = (index: number, value: string) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index] = value;
    setSubTasks(newSubTasks);
  };

  // 루틴 저장/수정
  const handleSave = async () => {
    // 유효성 검사
    if (!title.trim()) {
      Alert.alert('오류', '루틴 이름을 입력해주세요.');
      return;
    }

    if (subTasks.length === 0 || subTasks.every((task) => !task.trim())) {
      Alert.alert('오류', '최소 하나의 하위 작업을 입력해주세요.');
      return;
    }

    // 시간 포맷팅
    const timeString = `${alarmTime.getHours().toString().padStart(2, '0')}:${alarmTime.getMinutes().toString().padStart(2, '0')}`;

    // 하위 작업 데이터 준비
    const subTasksData = subTasks
      .filter((task) => task.trim())
      .map((task, index) => ({
        title: task.trim(),
        order: index + 1,
      }));

    if (isEdit) {
      // 수정 모드
      const updatePayload: UpdateRoutinePayload = {
        id: id as string,
        name: title.trim(),
        details: description.trim() || undefined,
        repeatCycle: repeatInfo,
        alarmTime: timeString,
        imageUrl: imageUrl || undefined,
        subTasks: subTasksData,
      };

      const result = await updateRoutine(updatePayload);
      if (result) {
        Alert.alert('성공', '루틴이 수정되었습니다.', [
          { text: '확인', onPress: () => router.back() },
        ]);
      }
    } else {
      // 생성 모드
      const createPayload: CreateRoutinePayload = {
        name: title.trim(),
        details: description.trim() || undefined,
        repeatCycle: repeatInfo,
        alarmTime: timeString,
        imageUrl: imageUrl || undefined,
        subTasks: subTasksData,
      };

      const result = await createRoutine(createPayload);
      if (result) {
        Alert.alert('성공', '루틴이 생성되었습니다.', [
          { text: '확인', onPress: () => router.back() },
        ]);
      }
    }
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
        <TouchableOpacity
          className="rounded-lg bg-cyan-600 px-4 py-2"
          onPress={() => router.back()}
        >
          <Text className="text-white">돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isSaving = isCreating || isUpdating;

  return (
    <View className="flex-1 bg-turquoise">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between bg-white px-4 py-3 shadow-sm">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#576BCD" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">{isEdit ? '루틴 수정' : '루틴 생성'}</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* 기본 정보 */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-bold text-black">기본 정보</Text>

          {/* 루틴 이름 */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray">루틴 이름</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="루틴 이름을 입력하세요"
              className="rounded-xl bg-white px-4 py-3 shadow-sm"
              placeholderTextColor="#B0B8CC"
            />
          </View>

          {/* 루틴 상세 */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray">루틴 상세</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="루틴에 대한 설명을 입력하세요"
              multiline
              numberOfLines={3}
              className="rounded-xl bg-white px-4 py-3 shadow-sm"
              placeholderTextColor="#B0B8CC"
            />
          </View>

          {/* 하위 작업 */}
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray">하위 작업</Text>
              <TouchableOpacity onPress={addSubTask}>
                <Ionicons name="add-circle-outline" size={24} color="#576BCD" />
              </TouchableOpacity>
            </View>
            {subTasks.map((task, index) => (
              <View key={index} className="mb-2 flex-row items-center gap-2">
                <CheckBox
                  checked={false}
                  onChange={() => {
                    /* 하위 작업 체크는 상세 페이지에서만 사용 */
                  }}
                />
                <TextInput
                  value={task}
                  onChangeText={(value) => updateSubTask(index, value)}
                  placeholder="하위 작업을 입력하세요"
                  className="flex-1 rounded-xl bg-white px-4 py-3 shadow-sm"
                  placeholderTextColor="#B0B8CC"
                />
                {subTasks.length > 1 && (
                  <TouchableOpacity onPress={() => removeSubTask(index)}>
                    <Ionicons name="remove-circle-outline" size={24} color="#FF4848" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* 사진 추가 */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray">사진</Text>
            <TouchableOpacity
              onPress={() => setShowImagePicker(true)}
              className="flex-row items-center justify-center rounded-xl border-2 border-dashed border-[#B0B8CC] bg-white py-8"
            >
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} className="h-20 w-20 rounded-lg" />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={32} color="#B0B8CC" />
                  <Text className="ml-2 text-sm text-[#B0B8CC]">사진 추가</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 옵션 설정 */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-bold text-black">옵션 설정</Text>

          {/* 반복 설정 */}
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray">반복</Text>
              <TouchableOpacity onPress={() => setShowRepeatInfo(true)}>
                <Ionicons name="information-circle-outline" size={20} color="#576BCD" />
              </TouchableOpacity>
            </View>
            <TextInput
              value={repeatInfo}
              onChangeText={(text) => setRepeatInfo(text as RepeatCycleType)}
              placeholder="예: 매일, 매주 수요일"
              className="rounded-xl bg-white px-4 py-3 shadow-sm"
              placeholderTextColor="#B0B8CC"
            />
          </View>

          {/* 알림 시간 */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray">알림 시간</Text>
            <AlarmTimePicker value={alarmTime} onChange={setAlarmTime} />
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View className="flex-row gap-3 bg-white px-4 py-4 shadow-lg">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 rounded-xl border border-[#B0B8CC] py-3"
          disabled={isSaving}
        >
          <Text className="text-center font-medium text-gray">취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          className={`flex-1 rounded-xl py-3 ${isSaving ? 'bg-gray-400' : 'bg-[#576BCD]'}`}
          disabled={isSaving}
        >
          {isSaving ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="white" />
              <Text className="ml-2 text-center font-medium text-white">
                {isEdit ? '수정 중...' : '생성 중...'}
              </Text>
            </View>
          ) : (
            <Text className="text-center font-medium text-white">{isEdit ? '수정' : '등록'}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 반복 설정 안내 모달 */}
      <RepeatInfoModal visible={showRepeatInfo} onClose={() => setShowRepeatInfo(false)} />
    </View>
  );
};

export default RoutineDetail;
