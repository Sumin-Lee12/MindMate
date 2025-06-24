import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

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

  const TaskItem = ({ time, title, completed, hasNotification }: TaskItemProps) => (
    <View className="relative mb-3 h-20 justify-center rounded-lg bg-white p-4 shadow-sm">
      <View
        className={`absolute left-0 h-20 w-2 rounded-l-md ${completed ? 'bg-teal' : 'bg-pink'}`}
      ></View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-gray mr-4 text-sm">{time}</Text>
          <Text className="text-md font-bold text-black">{title}</Text>
        </View>
        <View className="flex-row items-center">
          // 아이콘으로 들어가는 체크 표시와 종은 lucid Icon 설치 이후 수정하겠습니다!
          {completed ? (
            <View className="bg-teal mr-2 h-6 w-6 items-center justify-center rounded-md">
              <Text className="text-xs">✓</Text>
            </View>
          ) : (
            <View className="border-pink mr-2 h-6 w-6 items-center justify-center rounded-md border-2">
              <Text className="text-xs"></Text>
            </View>
          )}
          {hasNotification && (
            <View className="h-6 w-6 items-center justify-center">
              <Text className="text-xs">🔔</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-turquoise flex-1">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="mt-6 px-4">
          {/* Date Header */}
          <View className="relative mb-6 flex-row items-center justify-center">
            <Text className="text-paleCobalt text-lg">2025년 6월 5일</Text>
            <TouchableOpacity className="absolute right-0 p-2">
              // 아이콘으로 들어가는 체크 표시와 종은 lucid Icon 설치 이후 수정하겠습니다!
              <Text className=" text-xl text-blue-500">📅</Text>
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
                  <Text className="text-paleCobalt text-sm">{day}</Text>
                  <Text className="text-paleCobalt text-base font-medium">{dates[index]}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Achievement Banner */}
          <View className="bg-paleYellow shadow-dropShadowHard mb-6 h-[131px] items-center justify-center rounded-xl px-4 py-7">
            <View className="flex-row items-center justify-between">
              <View className="relative gap-4">
                <Text className="text-paleCobalt justify-start text-lg font-bold">
                  오늘 일정 <Text className="font-bold text-black">14</Text>개 중
                </Text>
                <Text className="text-paleCobalt text-xl font-bold">
                  총 <Text className="font-bold text-black">10</Text>개를 완료
                  <Text className="text-lg">했어요!</Text>
                </Text>
              </View>
              <Text className="bottom-6 z-20 text-[64px]">😊</Text>
            </View>
          </View>
        </View>

        {/* Task Sections */}
        <View className="px-4 pb-6">
          {/* Tab Indicators */}
          <View className="mb-4 flex-1 flex-row justify-end">
            <View className="mr-2 flex-row gap-2 px-3 py-1">
              <View className="bg-pink h-6 w-6"></View>
              <Text className="text-sm font-medium">미완료</Text>
            </View>
            <View className="mr-2 flex-row gap-2 px-3 py-1">
              <View className="bg-teal h-6 w-6"></View>
              <Text className="text-sm font-medium">완료</Text>
            </View>
          </View>

          {/* 미완료 칸 */}
          <Text className="text-md mb-3 font-bold text-black">미완료</Text>
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
          <Text className="text-md mb-3 mt-6 font-bold text-black">완료</Text>
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
        className="bg-paleCobalt absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full"
        style={{ elevation: 8 }}
      >
        // 체크 필요: 이 부분은 lucid Icon 설치한 이후에 텍스트가 아닌 아이콘으로 바꾸겠습니다!
        <Text className="text-5xl font-light text-white">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SchedulePage;
