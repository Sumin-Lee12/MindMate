import { useLocalSearchParams } from 'expo-router';
import FormEditContact from '@/src/features/address-book/components/form-edit-contact';
import Button from '@/src/components/ui/button';
import { Text, View } from 'react-native';
import { useState } from 'react';
import AddContactDetailGroupModal from '@/src/features/address-book/components/add-contact-detail-group-modal';
import ContactDetailGroupSectionList from '@/src/features/address-book/components/contact-detail-group-section-list';

const Edit = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <FormEditContact id={id} />
      <AddContactDetailGroupButton onPress={() => setIsModalVisible(true)} />
      <ContactDetailGroupSectionList id={id} isModalVisible={isModalVisible} />
      {isModalVisible && (
        <AddContactDetailGroupModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          id={id}
        />
      )}
    </>
  );
};

const AddContactDetailGroupButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <>
      <View className="w-20">
        <Button className=" bg-paleCobalt p-2" onPress={onPress}>
          <Text>목록추가</Text>
        </Button>
      </View>
    </>
  );
};

export default Edit;
