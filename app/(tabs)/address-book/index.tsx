import React from 'react';

import AddressBookSelfItem from '../../../src/features/address-book/components/address-book-self-item';
import AddressBookList from '../../../src/features/address-book/components/address-book-list.tsx';
import { View } from 'react-native';
import SearchInput from '../../../src/components/ui/search-input';

const AddressBook = () => {
  return (
    <View className="gap-6 bg-turquoise px-4 pt-6">
      <AddressBookSelfItem />
      <SearchInput></SearchInput>
      <AddressBookList />
    </View>
  );
};

export default AddressBook;
