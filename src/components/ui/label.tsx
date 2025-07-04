import { Text } from 'react-native';

/**
 * 공통 라벨 컴포넌트
 * @param children - 라벨 안에 들어갈 내용
 * @param className - 추가적인 스타일 클래스
 */
type LabelProps = {
  children: React.ReactNode;
  className?: string;
};

const Label = ({ children, className = '' }: LabelProps) => {
  return (
    <Text
      className={`rounded-3xl bg-paleCobalt px-2 py-1 text-sm font-medium text-white ${className}`}
    >
      {children}
    </Text>
  );
};

export default Label;
