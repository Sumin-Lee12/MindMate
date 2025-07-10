import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AddressBookName from './address-book-name';
import AddressBookImage from './address-book-image';

const AddressBookSelfItem = () => {
  return (
    <View className="flex-row justify-between px-4">
      <View className="flex items-center gap-4">
        <AddressBookName>김이름</AddressBookName>
        <TouchableOpacity className="flex-row items-center justify-center rounded-lg bg-paleCobalt py-1">
          <Text className="px-9 text-md text-white">상세 정보 보기</Text>
        </TouchableOpacity>
      </View>
      <View className="item-center flex">
        <AddressBookImage />
        <Text className="text-sm">010-0000-0000</Text>
      </View>
    </View>
  );
};

export default AddressBookSelfItem;
