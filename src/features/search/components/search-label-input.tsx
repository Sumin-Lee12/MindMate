import { Text, TextInput, View } from 'react-native';

type SearchLabelInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
};

const SearchLabelInput = ({
  value,
  onChangeText,
  label,
  placeholder,
  className,
  multiline = false,
}: SearchLabelInputProps) => {
  return (
    <View className={`mb-7 h-20 w-full items-start justify-center gap-2 ${className}`}>
      <Text className="text-md text-paleCobalt">{label}</Text>
      <TextInput
        className="w-full flex-1 rounded-xl bg-white px-4 text-sm shadow-dropShadow"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
};

export default SearchLabelInput;
