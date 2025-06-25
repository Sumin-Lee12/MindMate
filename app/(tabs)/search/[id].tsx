import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

const ItemDetailScreen = () => {
  const { id } = useLocalSearchParams();
  return <Text>ItemDetailScreen {id}</Text>;
};

export default ItemDetailScreen;
