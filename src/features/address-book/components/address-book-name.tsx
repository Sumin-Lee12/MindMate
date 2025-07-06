import { ReactNode } from 'react';
import { Text } from 'react-native';

type AddressBookNameProps = {
  children: ReactNode;
};

const AddressBookName = ({ children }: AddressBookNameProps) => {
  return <Text className="text-xl font-bold">{children}</Text>;
};

export default AddressBookName;
