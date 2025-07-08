import React from 'react';

import AddressBookSelfItem from '../../../src/features/address-book/components/address-book-self-item';
import AddressBookList from '../../../src/features/address-book/components/address-book-list.tsx';
import { View } from 'react-native';
import SearchInput from '../../../src/components/ui/search-input';
import AddressBookAddButton from '../../../src/features/address-book/components/address-book-add-button';
import { useAsyncDataGet } from '../../../src/hooks/use-async-data-get';
import {
  getMyContact,
  getOthersContacts,
} from '../../../src/features/address-book/services/get-address-book-data';
import { useCallback } from 'react';
import { Contact } from '../../../src/features/address-book/types/address-book-type';

const AddressBook = () => {
  return (
    <>
      {/* 고정 영역들 */}
      <View className="bg-turquoise px-4 pb-4 pt-6">
        <AddressBookSelfItem />
        <SearchInput />
      </View>

      {/* 스크롤 가능한 영역 */}
      <View className="flex-1 bg-turquoise px-4">
        <AddressBookList />
      </View>

      {/* 추가하기 버튼 */}
      <View className="absolute bottom-8 right-6">
        <AddressBookAddButton />
      </View>
    </>
  );
};

export default AddressBook;
