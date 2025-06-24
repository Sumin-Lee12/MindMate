// import { Text, View } from 'react-native';

// export default function HomeScreen() {
//   return (
//     //홈화면
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-xl font-bold text-blue-500">일정기록</Text>
//     </View>
//   );
// }

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

type TaskItemProps = {
  time: string;
  title: string;
  completed: boolean;
  hasNotification: boolean;
};

const SchedulePage = () => {
  const [selectedTab, setSelectedTab] = useState('일정');
  const [selectedDate, setSelectedDate] = useState(5);

  const tabs = ['일기', '일정', '루틴', '찾기', '주소록'];
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dates = [1, 2, 3, 4, 5, 6, 7];

  const TaskItem = ({ time, title, completed, hasNotification }: TaskItemProps) => (
    <View className="mb-3 rounded-lg bg-white p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="mr-4 text-sm text-gray-600">{time}</Text>
          <Text className="text-base font-medium text-gray-800">{title}</Text>
        </View>
        <View className="flex-row items-center">
          {completed && (
            <View className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-green-500">
              <Text className="text-xs text-white">✓</Text>
            </View>
          )}
          {hasNotification && (
            <View className="h-6 w-6 items-center justify-center rounded-full bg-red-500">
              <Text className="text-xs text-white">🔔</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-4 py-6">
          <Text className="mb-6 text-center text-2xl font-bold text-blue-500">MIND MATE</Text>

          {/* Tab Navigation */}
          <View className="mb-6 flex-row justify-between">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                className={`rounded-full px-4 py-2 ${
                  selectedTab === tab ? 'bg-blue-500' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedTab === tab ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-medium text-gray-700">2025년 6월 5일</Text>
            <TouchableOpacity className="p-2">
              <Text className="text-xl text-blue-500">📅</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Days */}
          <View className="mb-6 flex-row justify-between">
            {days.map((day, index) => (
              <View key={day} className="items-center">
                <Text className="mb-2 text-sm text-gray-600">{day}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedDate(dates[index])}
                  className={`h-10 w-10 items-center justify-center rounded-full ${
                    selectedDate === dates[index] ? 'bg-green-100' : 'bg-transparent'
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      selectedDate === dates[index] ? 'text-green-600' : 'text-gray-700'
                    }`}
                  >
                    {dates[index]}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Achievement Banner */}
          <View className="mb-6 rounded-lg bg-yellow-200 p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base font-medium text-gray-800">
                  오늘 일정 <Text className="font-bold">14</Text>개 중
                </Text>
                <Text className="text-base font-medium text-gray-800">
                  총 <Text className="font-bold text-green-600">10</Text>개를 완료했어요!
                </Text>
              </View>
              <Text className="text-3xl">😊</Text>
            </View>
          </View>
        </View>

        {/* Task Sections */}
        <View className="px-4 pb-6">
          {/* Tab Indicators */}
          <View className="mb-4 flex-row">
            <View className="mr-2 rounded-full bg-red-200 px-3 py-1">
              <Text className="text-sm font-medium text-red-700">미완료</Text>
            </View>
            <View className="rounded-full bg-green-200 px-3 py-1">
              <Text className="text-sm font-medium text-green-700">완료</Text>
            </View>
          </View>

          {/* 미완료 Section */}
          <Text className="mb-3 text-lg font-bold text-gray-800">미완료</Text>
          <TaskItem
            time="08:00"
            title="리액트 네이티브 공부"
            completed={true}
            hasNotification={false}
          />
          <TaskItem
            time="08:00"
            title="리액트 네이티브 공부"
            completed={false}
            hasNotification={true}
          />

          {/* 완료 Section */}
          <Text className="mb-3 mt-6 text-lg font-bold text-gray-800">완료</Text>
          <View className="mb-3 rounded-lg bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-center text-gray-400">...</Text>
            </View>
          </View>
          <TaskItem
            time="08:00"
            title="리액트 네이티브 공부"
            completed={false}
            hasNotification={false}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
        style={{ elevation: 8 }}
      >
        <Text className="text-2xl font-light text-white">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SchedulePage;
