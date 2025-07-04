import { TouchableOpacity, Text } from 'react-native';

type AddButtonProps = {
  onPress?: () => void;
  className?: string;
};

/**
 * 추가 버튼 컴포넌트
 * @param onPress - 버튼이 눌렸을 때 실행될 함수
 * @param className - 추가적인 스타일 클래스
 * @returns
 */

const AddButton = ({ onPress, className }: AddButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-paleCobalt shadow-lg ${className}`}
      activeOpacity={0.8}
    >
      <Text className="text-4xl font-semibold text-white">+</Text>
    </TouchableOpacity>
  );
};

export default AddButton;
