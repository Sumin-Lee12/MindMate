import { Image, TextInput, View } from 'react-native';

const SearchInput = () => {
  return (
    <View className="w-full flex-row items-center rounded-xl border bg-white px-4">
      /**Todo
        * 1. Search icon을 나중에 변경
       */
      <Image source={require('../../../assets/icons/search-icon.png')} />
      <TextInput className="h-[52px] flex-1" />
    </View>
  );
};

export default SearchInput;
