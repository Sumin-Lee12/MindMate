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
  SafeAreaView,
  Platform,
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import type { DateTimePickerProps } from 'react-native-modal-datetime-picker';

const RoutineDetail = () => {
  const { id, startDate } = useLocalSearchParams();
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
  const [deadline, setDeadline] = useState<string>('2025-07-31');
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [duration, setDuration] = useState<string>('00:00');
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(true);
  const [showAlarmTimePicker, setShowAlarmTimePicker] = useState(false);
  const [showRepeatInput, setShowRepeatInput] = useState(false);
  const [tempRepeatInfo, setTempRepeatInfo] = useState<string>('');

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
        setIsAlarmEnabled(true);
      }
      setImageUrl(routine.imageUrl || '');
      if (routine.deadline) setDeadline(routine.deadline);
      setDuration('00:00');
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
    const timeString = isAlarmEnabled
      ? `${alarmTime.getHours().toString().padStart(2, '0')}:${alarmTime.getMinutes().toString().padStart(2, '0')}`
      : undefined;

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
        repeatCycle: isRepeatEnabled ? repeatInfo : '없음',
        alarmTime: timeString,
        imageUrl: imageUrl || undefined,
        subTasks: subTasksData,
        deadline,
      };

      const result = await updateRoutine(updatePayload);
      if (result) {
        Alert.alert('성공', '루틴이 수정되었습니다.', [
          { text: '확인', onPress: () => router.back() },
        ]);
      }
    } else {
      const now = new Date();
      console.log('루틴 생성 시점 startDate:', startDate);
      console.log('루틴 생성 시점 createdAt(페이로드):', startDate);
      console.log(
        '루틴 생성 시점 new Date():',
        now,
        'KST:',
        new Date(now.getTime() + 9 * 60 * 60 * 1000),
      );
      const createPayload: CreateRoutinePayload = {
        name: title.trim(),
        details: description.trim() || undefined,
        repeatCycle: isRepeatEnabled ? repeatInfo : '없음',
        alarmTime: timeString,
        imageUrl: imageUrl || undefined,
        subTasks: subTasksData,
        startDate: startDate as string, // 시작 날짜 추가
        deadline,
        createdAt: startDate as string, // createdAt을 명시적으로 저장
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
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F4F4F4]">
        <ActivityIndicator size="large" color="#576BCD" />
        <Text className="text-gray-600 mt-4">루틴을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F4F4F4] px-4">
        <Text className="mb-4 text-center text-red-500">{error}</Text>
        <TouchableOpacity
          className="rounded-lg bg-cyan-600 px-4 py-2"
          onPress={() => router.back()}
        >
          <Text className="text-white">돌아가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isSaving = isCreating || isUpdating;

  return (
    <SafeAreaView className="flex-1 bg-[#F4F4F4]">
      {/* 헤더 */}
      <View className="mt-12 flex-row items-center justify-center rounded-t-xl bg-white px-4 py-4 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="absolute left-4">
          <Ionicons name="chevron-back" size={28} color="#576BCD" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#576BCD]">루틴 생성하기</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 16 }}
      >
        {/* 카드(폼) */}
        <View className="mb-6 w-[90%] rounded-2xl bg-white px-6 py-8 shadow-lg">
          {/* 이름 */}
          <View className="mb-4 flex-row items-center">
            <Text className="mr-4 w-16 text-base font-bold text-[#7B7FD6]">이름</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="루틴 이름 입력"
              className="flex-1 rounded-xl bg-white px-4 py-3 shadow"
              placeholderTextColor="#B0B8CC"
            />
          </View>

          {/* 상세 */}
          <View className="mb-4 flex-row items-center">
            <Text className="mr-4 w-16 text-base font-bold text-[#7B7FD6]">상세</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="루틴 이름을 입력해주세요"
              multiline
              numberOfLines={1}
              className="flex-1 rounded-xl bg-white px-4 py-3 shadow"
              placeholderTextColor="#B0B8CC"
            />
          </View>

          {/* 하위 작업 */}
          <Text className="mb-2 text-base font-bold text-[#7B7FD6]">하위 작업</Text>
          {subTasks.map((task, index) => (
            <View key={index} className="mb-2 flex-row items-center">
              <TextInput
                value={task}
                onChangeText={(text) => updateSubTask(index, text)}
                placeholder="하위 루틴 입력"
                className="mr-2 flex-1 rounded-xl bg-[#FFF3D6] px-4 py-3 shadow"
                placeholderTextColor="#B0B8CC"
              />
              {subTasks.length > 1 && (
                <TouchableOpacity onPress={() => removeSubTask(index)}>
                  <Ionicons name="remove-circle-outline" size={20} color="#FF4848" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity
            onPress={addSubTask}
            className="mb-4 rounded-xl border border-[#E0E4F7] bg-white px-4 py-3 shadow-sm"
          >
            <Text className="text-center text-base text-[#7B7FD6]">+ 새로운 하위 작업 추가</Text>
          </TouchableOpacity>

          {/* 사진 */}
          <Text className="mb-2 text-base font-bold text-[#7B7FD6]">사진</Text>
          <TouchableOpacity
            onPress={() => setShowImagePicker(true)}
            className="mb-6 h-20 w-20 items-center justify-center rounded-xl border-2 border-solid border-[#B0B8CC] bg-white shadow-sm"
          >
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} className="h-20 w-20 rounded-lg" />
            ) : (
              <Ionicons name="add" size={36} color="#7B7FD6" />
            )}
          </TouchableOpacity>

          {/* 옵션 영역 */}
          <View className="mb-6 rounded-xl bg-[#F7F8FD] px-4 py-4">
            {/* 반복 */}
            <View className="mb-3 flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#7B7FD6" style={{ marginRight: 8 }} />
              <Text style={{ width: 48 }} className="text-base font-bold text-[#7B7FD6]">
                반복
              </Text>
              <TouchableOpacity onPress={() => setShowRepeatInfo(true)} style={{ marginRight: 8 }}>
                <Ionicons name="help-circle-outline" size={16} color="#7B7FD6" />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1"
                onPress={() => {
                  if (isRepeatEnabled) {
                    setTempRepeatInfo(repeatInfo);
                    setShowRepeatInput(true);
                  }
                }}
              >
                <Text className="text-base text-[#222]">{repeatInfo}</Text>
              </TouchableOpacity>
              <CheckBox
                checked={isRepeatEnabled}
                onChange={() => setIsRepeatEnabled(!isRepeatEnabled)}
                size={16}
              />
            </View>

            {/* 알림 */}
            <View className="mb-3 flex-row items-center">
              <Ionicons
                name="notifications-outline"
                size={18}
                color="#7B7FD6"
                style={{ marginRight: 8 }}
              />
              <Text className="text-base font-bold text-[#7B7FD6]" style={{ width: 48 }}>
                알림
              </Text>
              <TouchableOpacity
                className="flex-1"
                onPress={() => {
                  if (isAlarmEnabled) {
                    setShowAlarmTimePicker(true);
                  } else {
                    setIsAlarmEnabled(true);
                  }
                }}
              >
                <Text className="text-base text-[#222]">
                  {isAlarmEnabled
                    ? `${alarmTime.getHours().toString().padStart(2, '0')}:${alarmTime.getMinutes().toString().padStart(2, '0')}`
                    : '알림 없음'}
                </Text>
              </TouchableOpacity>
              <CheckBox
                checked={isAlarmEnabled}
                onChange={() => setIsAlarmEnabled(!isAlarmEnabled)}
                size={16}
              />
            </View>

            {/* 알림 시간 선택기 */}
            <DateTimePickerModal
              isVisible={showAlarmTimePicker}
              mode="time"
              date={alarmTime}
              onConfirm={(date: Date) => {
                setAlarmTime(date);
                setShowAlarmTimePicker(false);
              }}
              onCancel={() => setShowAlarmTimePicker(false)}
              locale="ko"
            />

            {/* 기한 */}
            <TouchableOpacity
              className="mb-3 flex-row items-center"
              onPress={() => setShowDeadlinePicker(true)}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color="#7B7FD6"
                style={{ marginRight: 8 }}
              />
              <Text className="text-base font-bold text-[#7B7FD6]" style={{ width: 48 }}>
                기한
              </Text>
              <Text className="flex-1 text-base text-[#222]">{deadline}</Text>
              <View className="flex-row items-center">
                <Ionicons name="chevron-forward" size={16} color="#B0B8CC" />
              </View>
            </TouchableOpacity>

            {/* 기간 */}
            <View className="flex-row items-center">
              <Ionicons name="happy-outline" size={18} color="#7B7FD6" style={{ marginRight: 8 }} />
              <Text className="text-base font-bold text-[#7B7FD6]" style={{ width: 48 }}>
                기간
              </Text>
              <TouchableOpacity className="flex-1" onPress={() => setShowDurationPicker(true)}>
                <Text className="text-base text-[#222]">{duration}</Text>
              </TouchableOpacity>
              <View className="flex-row items-center">
                <Ionicons name="chevron-forward" size={16} color="#B0B8CC" />
              </View>
            </View>
          </View>

          {/* 기한 선택기 */}
          <DateTimePickerModal
            isVisible={showDeadlinePicker}
            mode="date"
            date={deadline ? new Date(deadline) : new Date()}
            onConfirm={(date: Date) => {
              setDeadline(date.toISOString().slice(0, 10));
              setShowDeadlinePicker(false);
            }}
            onCancel={() => setShowDeadlinePicker(false)}
            locale="ko"
          />

          {/* 기간 선택기 */}
          <DateTimePickerModal
            isVisible={showDurationPicker}
            mode="time"
            date={new Date()} // 기본값은 현재 시간
            onConfirm={(date: Date) => {
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              setDuration(`${hours}:${minutes}`);
              setShowDurationPicker(false);
            }}
            onCancel={() => setShowDurationPicker(false)}
            locale="ko"
          />

          {/* 하단 버튼 */}
          <View className="mt-2 flex-row gap-3">
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 rounded-xl bg-[#576BCD] py-3"
              disabled={isSaving}
            >
              <Text className="text-center text-base font-medium text-white">등록하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 rounded-xl bg-[#F7E6C4] py-3"
              disabled={isSaving}
            >
              <Text className="text-center text-base font-medium text-[#576BCD]">취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 반복 설정 안내 모달 */}
      <RepeatInfoModal visible={showRepeatInfo} onClose={() => setShowRepeatInfo(false)} />

      {/* 반복 입력 모달 */}
      {showRepeatInput && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black bg-opacity-50">
          <View className="w-80 rounded-xl bg-white p-6">
            <Text className="mb-4 text-center text-lg font-bold text-[#576BCD]">반복 설정</Text>
            <TextInput
              value={tempRepeatInfo}
              onChangeText={setTempRepeatInfo}
              placeholder="예: 매일, 매주 월요일, 3일마다"
              className="border-gray-200 mb-4 rounded-lg border p-3 text-base"
              placeholderTextColor="#B0B8CC"
            />
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 rounded-lg bg-[#576BCD] p-3"
                onPress={() => {
                  setRepeatInfo(tempRepeatInfo as RepeatCycleType);
                  setShowRepeatInput(false);
                }}
              >
                <Text className="text-center text-base font-medium text-white">확인</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-200 flex-1 rounded-lg p-3"
                onPress={() => setShowRepeatInput(false)}
              >
                <Text className="text-center text-base text-[#576BCD]">취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default RoutineDetail;
