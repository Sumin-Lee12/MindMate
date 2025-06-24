import { View } from 'react-native';

type CommonBoxProps = {
  children: React.ReactNode;
  color?: string;
};

const CommonBox = ({ children, color }: CommonBoxProps) => {
  return (
    <View
      className="w-full rounded-md bg-white p-4"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: color || 'paleCobalt', 
      }}
    >
      {children}
    </View>
  );
};

export default CommonBox;
