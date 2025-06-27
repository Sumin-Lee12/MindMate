import { TouchableOpacity } from 'react-native';

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
};

/**
 *
 * @param children - 버튼 안에 들어갈 내용
 * @param onPress - 버튼이 눌렸을 때 실행될 함수
 * @param className - 추가적인 스타일 클래스
 * @returns
 */

const Button = ({ children, onPress, className }: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`h-14 w-full items-center justify-center rounded-lg bg-paleCobalt ${className}`}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;
