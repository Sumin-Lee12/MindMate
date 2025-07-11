import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AddressBookName from './address-book-name';
import AddressBookImage from './address-book-image';
import { Contact } from '../types/address-book-type';
import { useCallback } from 'react';
import { getMyContact } from '../services/get-contact-data';
import { useAsyncDataGet } from '../../../hooks/use-async-data-get';

const AddressBookSelfItem = () => {
  const getMyContactUseCallBack = useCallback(getMyContact, []);
  const { data } = useAsyncDataGet<Contact>(getMyContactUseCallBack);

  if (!data) return null;

  return (
    <View className="flex-row justify-between px-4">
      <View className="flex items-center gap-4">
        <AddressBookName>{data.name}</AddressBookName>
        <TouchableOpacity className="flex-row items-center justify-center rounded-lg bg-paleCobalt py-1">
          <Text className="px-9 text-md text-white">상세 정보 보기</Text>
        </TouchableOpacity>
      </View>
      <View className="item-center flex">
        <AddressBookImage />
        <Text className="text-sm">{data.phone_number}</Text>
      </View>
    </View>
  );
};

export default AddressBookSelfItem;
