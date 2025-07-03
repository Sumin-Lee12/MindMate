import React, { ReactNode } from 'react';
import { Text } from 'react-native';

type AddressBookLabel = {
  children: ReactNode;
};

const AddressBookLabel = ({ children }: AddressBookLabel) => {
  return (
    <Text className="rounded-full bg-turquoise px-2 py-0.5 text-ss color-paleCobalt">
      {children}
    </Text>
  );
};

export default AddressBookLabel;
