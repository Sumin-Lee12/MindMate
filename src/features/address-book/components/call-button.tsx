import { View, Text, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { Phone } from 'lucide-react-native';

const CallButton = ({ phoneNumber }: { phoneNumber: string }) => {
  const handleCall = () => {
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url);
  };
  return (
    <TouchableOpacity
      className="flex-1 flex-row items-center justify-center rounded-full bg-paleCobalt py-1"
      onPress={handleCall}
    >
      <Phone size={16} className="" fill="white" stroke="none" />
      <Text className="ml-1 text-sm text-white">전화걸기</Text>
    </TouchableOpacity>
  );
};

export default CallButton;
