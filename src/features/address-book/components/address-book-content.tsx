import React, { ReactNode } from 'react';
import { Text } from 'react-native';

type AddressBOokContentProps = {
  children: ReactNode;
};

const AddressBookContent = ({ children }: AddressBOokContentProps) => {
  return <Text className="text-ss">{children}</Text>;
};

export default AddressBookContent;
