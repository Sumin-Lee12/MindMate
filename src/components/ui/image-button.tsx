import { Plus } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type ImageButtonProps = {
  onPress: () => void;
  // className?: string;
  image?: string;
};

const ImageButton = ({ onPress, image }: ImageButtonProps) => {
  return (
    <TouchableOpacity
      className="h-[72px] w-[72px] items-center justify-center rounded-xl bg-white p-4 shadow-dropShadow"
      onPress={onPress}
    >
      {image ? (
        <Image
          className="w-[72px] h-[72px] rounded-xl"
          source={{ uri: image }}
          resizeMode="cover"
        />
      ) : (
        <Text>
          <Plus color="#576bcd" strokeWidth={4} />
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ImageButton;
