import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Label from 'src/components/ui/label';
import CheckBox from 'src/components/ui/checkbox';
import Modal from 'src/components/ui/modal';
import AlarmTimePicker from 'src/features/routine/components/AlarmTimePicker';
import RepeatInfoModal from 'src/features/routine/components/RepeatInfoModal';

const RoutineDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isEdit = id !== 'new';

  // 상태 관리
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subTasks, setSubTasks] = useState(['']);
  const [repeatInfo, setRepeatInfo] = useState('');
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [duration, setDuration] = useState('');
  const [showRepeatInfo, setShowRepeatInfo] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

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

  return (
    <View className="flex-1 bg-[#F5F7FB]">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between bg-white px-4 py-3 shadow-sm">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#576BCD" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#222B45]">
          {isEdit ? '루틴 수정' : '루틴 생성'}
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* 기본 정보 */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-bold text-[#222B45]">기본 정보</Text>

          {/* 루틴 이름 */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-[#5B6B9A]">루틴 이름</Text>
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
            <Text className="mb-2 text-sm font-medium text-[#5B6B9A]">루틴 상세</Text>
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
              <Text className="text-sm font-medium text-[#5B6B9A]">하위 작업</Text>
              <TouchableOpacity onPress={addSubTask}>
                <Ionicons name="add-circle-outline" size={24} color="#576BCD" />
              </TouchableOpacity>
            </View>
            {subTasks.map((task, index) => (
              <View key={index} className="mb-2 flex-row items-center gap-2">
                <CheckBox
                  checked={false}
                  onChange={() => {
                    /* TODO: 하위 작업 체크 상태 변경 */
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
            <Text className="mb-2 text-sm font-medium text-[#5B6B9A]">사진</Text>
            <TouchableOpacity
              onPress={() => setShowImagePicker(true)}
              className="flex-row items-center justify-center rounded-xl border-2 border-dashed border-[#B0B8CC] bg-white py-8"
            >
              <Ionicons name="camera-outline" size={32} color="#B0B8CC" />
              <Text className="ml-2 text-sm text-[#B0B8CC]">사진 추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 옵션 설정 */}
        <View className="mb-6">
          <Text className="mb-3 text-lg font-bold text-[#222B45]">옵션 설정</Text>

          {/* 반복 설정 */}
          <View className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-medium text-[#5B6B9A]">반복</Text>
              <TouchableOpacity onPress={() => setShowRepeatInfo(true)}>
                <Ionicons name="information-circle-outline" size={20} color="#576BCD" />
              </TouchableOpacity>
            </View>
            <TextInput
              value={repeatInfo}
              onChangeText={setRepeatInfo}
              placeholder="예: 매일, 매주 수요일"
              className="rounded-xl bg-white px-4 py-3 shadow-sm"
              placeholderTextColor="#B0B8CC"
            />
          </View>

          {/* 알림 시간 */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-[#5B6B9A]">알림 시간</Text>
            <AlarmTimePicker value={alarmTime} onChange={setAlarmTime} />
          </View>

          {/* 소요 시간 */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-[#5B6B9A]">소요 시간</Text>
            <TextInput
              value={duration}
              onChangeText={setDuration}
              placeholder="예: 30분"
              className="rounded-xl bg-white px-4 py-3 shadow-sm"
              placeholderTextColor="#B0B8CC"
            />
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View className="flex-row gap-3 bg-white px-4 py-4 shadow-lg">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 rounded-xl border border-[#B0B8CC] py-3"
        >
          <Text className="text-center font-medium text-[#5B6B9A]">취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            /* TODO: 루틴 저장/수정 */
          }}
          className="flex-1 rounded-xl bg-[#576BCD] py-3"
        >
          <Text className="text-center font-medium text-white">{isEdit ? '수정' : '등록'}</Text>
        </TouchableOpacity>
      </View>

      {/* 반복 설정 안내 모달 */}
      <RepeatInfoModal visible={showRepeatInfo} onClose={() => setShowRepeatInfo(false)} />
    </View>
  );
};

export default RoutineDetail;
