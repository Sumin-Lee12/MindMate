import { TouchableOpacity, Text, Linking } from 'react-native';
import { Mail } from 'lucide-react-native';

const MessageButton = ({ phoneNumber }: { phoneNumber: string }) => {
  const handleMessage = () => {
    Linking.openURL(`sms:${phoneNumber}`);
  };

  return (
    <TouchableOpacity
      className="flex-1 flex-row items-center justify-center rounded-full border border-paleCobalt py-1"
      onPress={handleMessage}
    >
      <Mail size={16} color="#576bcd" />
      <Text className="ml-1 text-sm text-paleCobalt">문자하기</Text>
    </TouchableOpacity>
  );
};

export default MessageButton;
