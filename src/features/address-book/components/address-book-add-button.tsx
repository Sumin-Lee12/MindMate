import AddButton from '@/src/components/ui/add-button';
import React from 'react';
import { useRouter } from 'expo-router';

export const AddressBookAddButton = () => {
  const router = useRouter();
  const handlePress = () => {
    router.push('/address-book/edit/new');
  };

  return <AddButton onPress={handlePress}></AddButton>;
};

export default AddressBookAddButton;
