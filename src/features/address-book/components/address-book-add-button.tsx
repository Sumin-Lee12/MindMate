import AddButton from '@/src/components/ui/add-button';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export const AddressBookAddButton = () => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('address-book/add' as never);
  };

  return <AddButton onPress={handlePress}></AddButton>;
};

export default AddressBookAddButton;
