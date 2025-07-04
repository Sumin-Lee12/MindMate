import { TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

/**
 * 공통 체크박스 컴포넌트
 * @param checked - 체크 여부
 * @param onChange - 체크 상태 변경 함수
 * @param className - 추가적인 스타일 클래스
 */
type CheckBoxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

const CheckBox = ({ checked, onChange, className = '' }: CheckBoxProps) => {
  return (
    <TouchableOpacity
      onPress={() => onChange(!checked)}
      className={`h-10 w-10 items-center justify-center rounded-md ${checked ? 'bg-paleCobalt' : 'border-2 border-gray bg-white'} ${className}`}
      activeOpacity={0.8}
    >
      {checked && <Check size={20} color="#fff" strokeWidth={3} />}
    </TouchableOpacity>
  );
};

export default CheckBox;
