import { Search } from 'lucide-react-native';
import { Dispatch, SetStateAction } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

type SearchInputType = {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onSubmitEditing?: () => void;
  placeholder?: string;
};

const SearchInput = ({ value, onChange, onSubmitEditing, placeholder }: SearchInputType) => {
  return (
    <View className="w-full flex-row items-center rounded-full bg-white px-4 shadow-dropShadow">
      <TextInput
        className="h-10 flex-1"
        value={value}
        onChangeText={onChange}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
      />
      <TouchableOpacity onPress={onSubmitEditing}>
        <Search />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
