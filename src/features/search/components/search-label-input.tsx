import { Text, TextInput, View } from 'react-native';

type SearchLabelInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
  multiline?: boolean;
  errors?: string;
};

const SearchLabelInput = ({
  value,
  onChangeText,
  label,
  placeholder,
  className,
  onBlur,
  multiline = false,
  errors,
}: SearchLabelInputProps) => {
  return (
    <View className={`mb-9 w-full items-start justify-center gap-2 ${className}`}>
      <Text className="text-lg text-paleCobalt">{label}</Text>
      <TextInput
        className={`w-full rounded-xl bg-white px-4 text-sm shadow-dropShadow ${multiline ? 'h-24 py-2' : 'h-[52px]'}`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        onBlur={onBlur}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      <View className="h-5">
        {errors && <Text className="text-ss text-red-500">{errors}</Text>}
      </View>
    </View>
  );
};

export default SearchLabelInput;
