import React from 'react';
import { ScrollView, View } from 'react-native';
import AddressBookItem from './address-book-item';
import { Contact } from '../types/address-book-type';
import { getOthersContacts } from '../services/get-address-book-data';
import { useCallback } from 'react';
import { useAsyncDataGet } from '../../../hooks/use-async-data-get';

const AddressBookList = () => {
  const getOthersContactsUseCallBack = useCallback(getOthersContacts, []);
  const { data } = useAsyncDataGet<Contact[]>(getOthersContactsUseCallBack);

  if (!data) return null;

  return (
    <ScrollView className="h-full">
      <View className="flex-col gap-2">
        {data.map((contact) => {
          return <AddressBookItem key={contact.id} contact={contact} />;
        })}
      </View>
    </ScrollView>
  );
};

export default AddressBookList;
