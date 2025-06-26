import { Search } from 'lucide-react-native';
import { TextInput, TouchableOpacity, View } from 'react-native';

const SearchInput = () => {
  return (
    <View className="w-full flex-row items-center rounded-full bg-white px-4 shadow-dropShadow">
      <TextInput className="h-10 flex-1" />
      <TouchableOpacity>
        <Search />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
