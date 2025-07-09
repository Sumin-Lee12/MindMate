import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import AddressBookItem from './address-book-item';
import { Contact } from '../types/address-book-type';
import { getOthersContacts } from '../services/get-contact-data';
import { useCallback } from 'react';
import { useAsyncDataGet } from '../../../hooks/use-async-data-get';
import { useFocusPage } from '@/src/hooks/use-focus-page';

const AddressBookList = () => {
  const getOthersContactsUseCallBack = useCallback(getOthersContacts, []);
  const { data, refetch } = useAsyncDataGet<Contact[]>(getOthersContactsUseCallBack);
  useFocusPage(refetch);

  if (!data) return null;

  return (
    <ScrollView className="flex-1">
      <View className="flex-col gap-2 last:mb-20">
        {data.map((contact) => {
          return <AddressBookItem key={contact.id} contact={contact} />;
        })}
      </View>
    </ScrollView>
  );
};

export default AddressBookList;
