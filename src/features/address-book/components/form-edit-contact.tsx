import { useContactEditState } from '../hooks/use-contact-edit-state';
import { MODE } from '../constants/address-book-constants';
import { createContact, updateContact } from '../services/mutation-address-book-data';
import { TextInput, View } from 'react-native';
import AddressBookImage from './address-book-image';
import Button from '@/src/components/ui/button';
import { Text } from 'react-native';

const FormEditContact = ({ id }: { id: string }) => {
  const { name, phoneNumber, memo, data, setName, setPhoneNumber, setMemo, refetch } =
    useContactEditState(id);
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

  const formTextStyle = 'border-gray-300 rounded-md border-b-2 p-2 font-bold';

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
        profile_image: null,
        is_me: 0,
        created_at: crate_at,
      });
    }
  };

  return (
    <>
      <View className="flex-row items-center justify-evenly">
        <View>
          <TextInput
            className={`text-xl ${formTextStyle}`}
            value={name}
            onChangeText={setName}
            placeholder={placeHolder[mode].name}
          />
          <TextInput
            className={`text-sm ${formTextStyle}`}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder={placeHolder[mode].phoneNumber}
          />
        </View>
        <AddressBookImage />
      </View>
      <TextInput
        className={`text-sm ${formTextStyle}`}
        value={memo}
        onChangeText={setMemo}
        placeholder={placeHolder[mode].description}
      />
      <Button className="bg-paleCobalt p-2" onPress={handleSave}>
        <Text className="text-white">저장</Text>
      </Button>
    </>
  );
};
export default FormEditContact;
