import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { Calendar, Check, BellRing, BellOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '../../../src/constants/colors';

type TaskItemProps = {
  time: string;
  title: string;
  completed: boolean;
  hasNotification: boolean;
};

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(5);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dates = [1, 2, 3, 4, 5, 6, 7];

  const handlePress = () => {
    router.push('/(tabs)/schedule/create');
  };

  const TaskItem = ({ time, title, completed, hasNotification }: TaskItemProps) => (
    <View className="relative mb-3 h-20 justify-center rounded-lg bg-white p-4 shadow-dropShadow">
      <View
        className={`absolute left-0 h-20 w-2 rounded-l-md ${completed ? 'bg-teal' : 'bg-pink'}`}
      ></View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="mr-4 text-sm text-gray">{time}</Text>
          <Text className="text-md font-bold text-black">{title}</Text>
        </View>
        <View className="flex-row items-center">
          {/** 아이콘으로 들어가는 체크 표시와 종은 lucid Icon 설치 이후 수정하겠습니다! */}
          {completed ? (
            <View className="mr-2 h-7 w-7 items-center justify-center rounded-md bg-teal">
              <Text className="text-xs">
                <Check color={Colors.black} />
              </Text>
            </View>
          ) : (
            <>
              <View className="mr-4 h-7 w-7 items-center justify-center rounded-md border-2 border-pink">
                <Text className="text-xs"></Text>
              </View>
              <View className="h-7 w-7 items-center justify-center">
                <Text className="text-xs">
                  {hasNotification ? (
                    <BellRing color={Colors.red} />
                  ) : (
                    <BellOff color={Colors.gray} />
                  )}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-turquoise">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="mt-6 px-4">
          {/* Date Header */}
          <View className="relative mb-6 flex-row items-center justify-center">
            <Text className="text-lg text-paleCobalt">2025년 6월 5일</Text>
            <TouchableOpacity className="absolute right-0 p-2">
              <Calendar color={Colors.paleCobalt} />
            </TouchableOpacity>
          </View>

          {/* Calendar Days */}
          <View className="mb-6 flex-row justify-between">
            {days.map((day, index) => (
              <View key={day} className="items-center">
                <TouchableOpacity
                  onPress={() => setSelectedDate(dates[index])}
                  className={`h-20 w-10 items-center justify-center gap-2 rounded-full ${
                    selectedDate === dates[index] ? 'bg-teal' : 'bg-transparent'
                  }`}
                >
                  <Text className="text-sm text-paleCobalt">{day}</Text>
                  <Text className="text-base font-medium text-paleCobalt">{dates[index]}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Achievement Banner */}
          <View className="mb-6 h-[131px] items-center justify-center rounded-xl bg-paleYellow px-4 py-7 shadow-dropShadowHard">
            <View className="flex-row items-center justify-between">
              <View className="relative gap-4">
                <Text className="justify-start text-lg font-bold text-paleCobalt">
                  오늘 일정 <Text className="font-bold text-black">14</Text>개 중
                </Text>
                <Text className="text-xl font-bold text-paleCobalt">
                  총 <Text className="font-bold text-black">10</Text>개를 완료
                  <Text className="text-lg">했어요!</Text>
                </Text>
              </View>
              <Image
                className="bottom-6 z-20 h-16 w-16"
                source={require('@assets/winking-face-png.png')}
              />
            </View>
          </View>
        </View>

        {/* Task Sections */}
        <View className="px-4 pb-6">
          {/* Tab Indicators */}
          <View className="mb-4 flex-1 flex-row justify-end">
            <View className="mr-2 flex-row gap-2 px-3 py-1">
              <View className="h-6 w-6 rounded-md bg-pink"></View>
              <Text className="text-sm font-medium">미완료</Text>
            </View>
            <View className="mr-2 flex-row gap-2 px-3 py-1">
              <View className="h-6 w-6 rounded-md bg-teal"></View>
              <Text className="text-sm font-medium">완료</Text>
            </View>
          </View>

          {/* 미완료 칸 */}
          <Text className="mb-3 text-md font-bold text-black">미완료</Text>
          <TaskItem
            time="08:00"
            title="리액트 네이티브 공부"
            completed={false}
            hasNotification={false}
          />
          <TaskItem
            time="08:00"
            title="리액트 네이티브 공부"
            completed={false}
            hasNotification={true}
          />

          {/* 완료 칸 */}
          <Text className="mb-3 mt-6 text-md font-bold text-black">완료</Text>
          <TaskItem
            time="08:00"
            title="리액트 네이티브 공부"
            completed={true}
            hasNotification={false}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-paleCobalt"
        onPress={() => handlePress()}
      >
        <Text className="text-5xl font-light text-white">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SchedulePage;
