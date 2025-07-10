import { useLocalSearchParams } from 'expo-router';
import FormEditContact from '@/src/features/address-book/components/form-edit-contact';
import { Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import EditContactDetailGroupModal from '@/src/features/address-book/components/edit-contact-detail-group-modal';
import ContactDetailGroupSectionList from '@/src/features/address-book/components/contact-detail-group-section-list';
import { CircleCheckBig } from 'lucide-react-native';

const Edit = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <FormEditContact id={id} />
      <ContactDetailGroupSectionList id={id} isModalVisible={isModalVisible} />
      <View className="h-20 items-center justify-start">
        <AddContactDetailGroupButton onPress={() => setIsModalVisible(true)} />
      </View>
      {isModalVisible && (
        <EditContactDetailGroupModal
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
        <TouchableOpacity className="flex-row items-center justify-center gap-2" onPress={onPress}>
          <View className="items-center gap-2">
            <CircleCheckBig size={24} color="#576BCD" />
            <Text className="text-ss font-normal text-paleCobalt">목록추가</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Edit;
