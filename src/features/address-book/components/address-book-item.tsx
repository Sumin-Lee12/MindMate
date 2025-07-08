import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import CommonBox from '../../../components/ui/common-box';
import AddressBookLabel from './address-book-label';
import AddressBookName from './address-book-name';
import { Mail, Phone } from 'lucide-react-native';
import AddressBookContent from './address-book-content';
import AddressBookImage from './address-book-image';
import { Contact } from '../types/address-book-type';

const AddressBookItem = ({ contact }: { contact: Contact }) => {
  return (
    <CommonBox color="paleCobalt">
      {/* 상단 부분 */}
      <View className="flex-row justify-between">
        <View className="flex-row flex-wrap gap-1">
          <AddressBookLabel>가족</AddressBookLabel>
          <AddressBookLabel>딸</AddressBookLabel>
          <AddressBookLabel>친구</AddressBookLabel>
        </View>
        <View className="flex-row items-start justify-between">
          <AddressBookName>{contact.name}</AddressBookName>
        </View>
        {/* TODO 햄버거 만들기 */}
      </View>

      <View className="flex-row">
        {/* 프로필사진 컴포넌트 */}
        <View className="flex-[1] justify-center">
          <AddressBookImage />
        </View>

        {/* 텍스트 정보 */}
        <View className="flex-[2]">
          {/* 한줄 상세 설명 */}
          <AddressBookContent>{contact.memo}</AddressBookContent>

          {/* 버튼 */}
          <View className="mt-3 flex-row gap-2">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-full bg-paleCobalt py-1">
              <Phone size={16} className="" fill="white" stroke="none" />
              <Text className="ml-1 text-sm text-white">전화걸기</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-full border border-paleCobalt py-1">
              <Mail size={16} color="#576bcd" />
              <Text className="ml-1 text-sm text-paleCobalt">문자하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CommonBox>
  );
};

export default AddressBookItem;

{
  /* 라벨 들어갈 위치 */
}
