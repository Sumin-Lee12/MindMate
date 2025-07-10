import React, { useState } from 'react';

import AddressBookSelfItem from '../../../src/features/address-book/components/address-book-self-item';
import AddressBookList from '../../../src/features/address-book/components/address-book-list.tsx';
import { View } from 'react-native';
import SearchInput from '../../../src/components/ui/search-input';
import AddressBookAddButton from '../../../src/features/address-book/components/address-book-add-button';
const AddressBook = () => {
  const [search, setSearch] = useState('');
  return (
    <>
      {/* 고정 영역들 */}
      <View className="bg-turquoise px-4 pb-4 pt-6">
        <AddressBookSelfItem />
        <SearchInput value={search} onChange={setSearch} />
      </View>

      {/* 스크롤 가능한 영역 */}
      <View className="flex-1 bg-turquoise">
        <AddressBookList />
      </View>
      {/* 추가하기 버튼 */}
      <View className="absolute bottom-1 right-1">
        <AddressBookAddButton />
      </View>
    </>
  );
};

export default AddressBook;
