import React from 'react';
import { ScrollView, View } from 'react-native';
import AddressBookItem from './address-book-item';

const AddressBookList = () => {
  const arr = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <ScrollView>
      <View className="flex-col gap-2">
        {arr.map((idx) => {
          return <AddressBookItem key={idx} />;
        })}
      </View>
    </ScrollView>
  );
};

export default AddressBookList;
