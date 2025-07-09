import { Plus } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

type ImageButtonProps = {
  onPress: () => void;
  className?: string;
};

const ImageAddButton = ({ onPress, className }: ImageButtonProps) => {
  return (
    <View className={`h-28 w-full items-start justify-center gap-2 ${className}`}>
      <Text className="text-md text-paleCobalt">사진</Text>
      <TouchableOpacity
        className="h-[72px] w-[72px] items-center justify-center rounded-xl bg-white p-4 shadow-dropShadow"
        onPress={onPress}
      >
        <Text>
          <Plus color="#576bcd" strokeWidth={4} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageAddButton;
