import { Modal, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useState } from 'react';
import { createNoteGroup } from '../services/mutation-note-group-data';
import { formTextStyle } from '../constants/style-class-constants';
import Button from '@/src/components/ui/button';

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
    <Modal
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
      transparent={true}
    >
      <View className="flex flex-1">
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View className="flex-1 bg-black/50"></View>
        </TouchableWithoutFeedback>
        <View className="h-40 items-center justify-between bg-white">
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
        </View>
      </View>
    </Modal>
  );
};

export default AddContactDetailGroupModal;
