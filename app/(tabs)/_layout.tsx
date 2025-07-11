import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomTopTabBar from '../../src/components/CustomTopTabBar';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <MaterialTopTabs tabBar={(props) => <CustomTopTabBar {...props} />}>
      <MaterialTopTabs.Screen name="diary/index" options={{ title: '일기' }} />
      <MaterialTopTabs.Screen name="schedule/index" options={{ title: '일정' }} />
      <MaterialTopTabs.Screen name="routine/index" options={{ title: '루틴' }} />
      <MaterialTopTabs.Screen name="search" options={{ title: '찾기' }} />
      <MaterialTopTabs.Screen name="address-book" options={{ title: '주소록' }} />
    </MaterialTopTabs>
  );
}
