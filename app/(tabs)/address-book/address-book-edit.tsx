import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import AddressBookImage from '@/src/features/address-book/components/address-book-image';

const Add = () => {
  const [text, setText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');

  return (
    <>
      <View className="flex-row items-center justify-evenly">
        <View>
          <TextInput
            className="border-gray-300 rounded-md border-b-2 p-2 text-xl font-bold"
            value={text}
            onChangeText={setText}
            placeholder="이름 입력"
          />
          <TextInput
            className="border-gray-300 rounded-md border-b-2 p-2 text-sm font-bold"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="전화번호 입력"
          />
        </View>
        <AddressBookImage />
      </View>
      <TextInput
        className="border-gray-300 rounded-md border-b-2 p-2 text-sm font-bold"
        value={description}
        onChangeText={setDescription}
        placeholder="간단한 설명 입력"
      />
    </>
  );
};

export default Add;
