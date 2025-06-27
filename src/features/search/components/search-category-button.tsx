import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { getCategoryData } from '../utils/getCategoryData';

type SearchCategoryButtonProps = {
  label: string;
};

const SearchCategoryButton = ({ label }: SearchCategoryButtonProps) => {
  const { icon, color } = getCategoryData(label);

  return (
    <TouchableOpacity
      className={`h-[50px] w-[50px] items-center justify-center rounded-xl bg-${color}`}
    >
      <Text>{icon}</Text>
    </TouchableOpacity>
  );
};

export default SearchCategoryButton;
