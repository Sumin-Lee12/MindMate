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
    <View
      className={`h-${errors ? 28 : 20} w-full items-start justify-center gap-2 ${className}`}
    >
      <Text className="text-md text-paleCobalt">{label}</Text>
      <TextInput
        className="w-full flex-1 rounded-xl bg-white px-4 text-sm shadow-dropShadow"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        onBlur={onBlur}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {errors && <Text className="text-ss text-red-500">{errors}</Text>}
    </View>
  );
};

export default SearchLabelInput;
