import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        //탭바 스타일
        tabBarStyle: {
          backgroundColor: '#ffffff',
          paddingTop: 40, // 상태바 여백
        },

        //탭 목록 스타일
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },

        //클릭 시 글자 색
        tabBarActiveTintColor: '#2563eb',

        //클릭 안되어 있는 요소들 글자 색
        tabBarInactiveTintColor: '#6b7280',

        //클릭 시 밑에 표시되는 부분 스타일
        tabBarIndicatorStyle: {
          backgroundColor: '#2563eb',
          height: 3,
        },

        // 스크롤 비활성화
        tabBarScrollEnabled: false,
        tabBarItemStyle: {
          flex: 1, //동일한 사이즈로 탭 바 구성
          minWidth: 60,
        },
      }}
    >
      <MaterialTopTabs.Screen name="diary/index" options={{ title: '일기' }} />
      <MaterialTopTabs.Screen name="schedule/index" options={{ title: '일정' }} />
      <MaterialTopTabs.Screen name="routine/index" options={{ title: '루틴' }} />
      <MaterialTopTabs.Screen name="search" options={{ title: '물건찾기' }} />
      <MaterialTopTabs.Screen name="address-book/index" options={{ title: '주소록' }} />
    </MaterialTopTabs>
  );
}
