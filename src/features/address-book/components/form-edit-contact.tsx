import { useContactEditState } from '../hooks/use-contact-edit-state';
import { MODE } from '../constants/address-book-constants';
import { createContact, updateContact } from '../services/mutation-contact-data';
import { TextInput, TouchableOpacity, View } from 'react-native';
import AddressBookImage from './address-book-image';
import { Text } from 'react-native';

// 업데이트된 폼 스타일
export const formTextStyle =
  'bg-white rounded-lg border border-gray-200 px-3 py-2 text-gray-800 shadow-sm focus:border-paleCobalt focus:shadow-md';

const FormEditContact = ({ id }: { id: string }) => {
  const {
    name,
    phoneNumber,
    memo,
    data,
    setName,
    setPhoneNumber,
    setMemo,
    refetch,
    image,
    setImage,
  } = useContactEditState(id);
  const mode = data ? MODE.EDIT : MODE.NEW;
  const placeHolder = {
    [MODE.NEW]: {
      name: '이름',
      phoneNumber: '전화번호',
      description: '간단한 설명',
    },
    [MODE.EDIT]: {
      name: data?.name,
      phoneNumber: data?.phone_number,
      description: data?.memo,
    },
  };

  const handleSave = async () => {
    const crate_at = new Date().toISOString();
    if (mode === MODE.EDIT) {
      await updateContact(id, { name, phone_number: phoneNumber, memo });
      refetch();
    }
    if (mode === MODE.NEW) {
      createContact({
        name,
        phone_number: phoneNumber,
        memo,
        profile_image: image,
        is_me: 0,
        created_at: crate_at,
      });
    }
  };

  return (
    <View className="bg-gray-50 mx-3 rounded-xl p-4 shadow-md">
      {/* 프로필 섹션 */}
      <View className="mb-4 flex-row items-center">
        <View className="mr-3 flex-1">
          <View className="mb-3">
            <Text className="text-gray-600 mb-1 text-xs font-medium">이름</Text>
            <TextInput
              className={`text-lg font-bold ${formTextStyle}`}
              value={name}
              onChangeText={setName}
              placeholder={placeHolder[mode].name}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-1 text-xs font-medium">전화번호</Text>
            <TextInput
              className={`text-sm ${formTextStyle}`}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder={placeHolder[mode].phoneNumber}
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <AddressBookImage setUrl={setImage} id={id} image={image} />
      </View>

      {/* 메모 섹션 */}
      <View className="mb-4">
        <Text className="text-gray-600 mb-1 text-xs font-medium">메모</Text>
        <TextInput
          className={`text-sm ${formTextStyle} h-16`}
          value={memo}
          onChangeText={setMemo}
          placeholder={placeHolder[mode].description}
          placeholderTextColor="#9CA3AF"
          multiline={true}
          textAlignVertical="top"
        />
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity
        onPress={handleSave}
        className="active:scale-98 rounded-xl bg-paleCobalt px-6 py-3 shadow-md active:shadow-sm"
      >
        <Text className="text-center text-base font-bold text-white">
          {mode === MODE.EDIT ? '수정하기' : '저장하기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormEditContact;
