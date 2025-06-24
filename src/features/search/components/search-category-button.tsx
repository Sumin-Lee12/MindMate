import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type SearchCategoryButtonProps = {
  category: {
    icon: React.ReactNode;
    label?: string;
    color: string;
  };
};

const SearchCategoryButton = ({ category }: SearchCategoryButtonProps) => {
  return (
    <TouchableOpacity
      className={`h-[50px] w-[50px] items-center justify-center rounded-xl bg-${category.color}`}
    >
      <Text>{category.icon}</Text>
    </TouchableOpacity>
  );
};

export default SearchCategoryButton;
