import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type SearchCategoryButtonProps = {
  label: string;
};

type LabelColorMap = '개인용품' | '모바일' | '전자제품' | '주방용품';

const SearchCategoryButton = ({ label }: SearchCategoryButtonProps) => {
  const labelColorMap: Record<LabelColorMap, string> = {
    개인용품: 'foggyBlue',
    모바일: 'paleYellow',
    전자제품: 'pink',
    주방용품: 'teal',
  };

  const color = labelColorMap[label as LabelColorMap] ?? 'foggyBlue';

  const iconMap: Record<LabelColorMap, string> = {
    개인용품: '🗝️',
    모바일: '📱',
    전자제품: '💻',
    주방용품: '☕',
  };

  const icon = iconMap[label as LabelColorMap] ?? '🫠';

  return (
    <TouchableOpacity
      className={`h-[50px] w-[50px] items-center justify-center rounded-xl bg-${color}`}
    >
      <Text>{icon}</Text>
    </TouchableOpacity>
  );
};

export default SearchCategoryButton;
