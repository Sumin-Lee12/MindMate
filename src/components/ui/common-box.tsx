import { View } from 'react-native';

type CommonBoxProps = {
  children: React.ReactNode;
  color?: string;
};

const CommonBox = ({ children, color }: CommonBoxProps) => {
  return (
    <View
      className={`w-full rounded-md border-l-4 border-l-${color ? color : 'paleCobalt'} bg-white p-4`}
    >
      {children}
    </View>
  );
};

export default CommonBox;
