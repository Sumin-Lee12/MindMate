import { useState } from 'react';
import { createNoteItem } from '../services/mutation-note-group-data';
import { formTextStyle } from '../constants/style-class-constants';
import Button from '@/src/components/ui/button';
import BottomModal from '@/src/components/ui/bottom-modal';
import { Text, TextInput, View } from 'react-native';

const AddContactDetailGroupItemModal = ({
  isModalVisible,
  setIsModalVisible,
  groupId,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  groupId: number;
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddContactDetailGroupItem = async () => {
    await createNoteItem(groupId.toString(), title, content);
  };

  return (
    <BottomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <View className="w-full px-10 pb-2 pt-4">
        <TextInput
          className={`text-md ${formTextStyle}`}
          value={title}
          onChangeText={setTitle}
          placeholder="제목을 입력하세요"
        />
        <TextInput
          className={`text-md ${formTextStyle}`}
          value={content}
          onChangeText={setContent}
          placeholder="설명을 입력하세요"
        />
      </View>
      <View className="w-full px-10 pb-4">
        <Button onPress={handleAddContactDetailGroupItem}>
          <Text>목록추가</Text>
        </Button>
      </View>
    </BottomModal>
  );
};

export default AddContactDetailGroupItemModal;
