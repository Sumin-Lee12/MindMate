import { Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { createNoteGroup } from '../services/mutation-note-group-data';
import { formTextStyle } from '../constants/style-class-constants';
import Button from '@/src/components/ui/button';
import BottomModal from '@/src/components/ui/bottom-modal';

const AddContactDetailGroupModal = ({
  isModalVisible,
  setIsModalVisible,
  id,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  id: string;
}) => {
  const [groupName, setGroupName] = useState('');

  const handleAddContactDetailGroup = async () => {
    await createNoteGroup(id, groupName);
  };

  return (
    <BottomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <View className="w-full px-10 pb-2 pt-4">
        <TextInput
          className={`text-md ${formTextStyle}`}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="목록 이름을 입력해주세요."
        />
      </View>
      <View className="w-full px-10 pb-4">
        <Button onPress={handleAddContactDetailGroup}>
          <Text>목록추가</Text>
        </Button>
      </View>
    </BottomModal>
  );
};

export default AddContactDetailGroupModal;
