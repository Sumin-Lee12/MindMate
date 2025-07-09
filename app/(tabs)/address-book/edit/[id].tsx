import { useLocalSearchParams } from 'expo-router';
import FormEditContact from '@/src/features/address-book/components/form-edit-contact';
import Button from '@/src/components/ui/button';
import { Text } from 'react-native';

const Edit = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <FormEditContact id={id} />
      <AddContactDetailGroupButton />
    </>
  );
};

const AddContactDetailGroupButton = () => {
  return (
    <Button className="bg-paleCobalt p-2">
      <Text>목록추가</Text>
    </Button>
  );
};

export default Edit;
