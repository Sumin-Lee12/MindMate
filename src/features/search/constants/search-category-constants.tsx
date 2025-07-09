import { Coffee, Key, Laptop, Tablet } from 'lucide-react-native';

export const searchCategoryLabels = {
  personal: '개인용품',
  mobile: '모바일',
  electronics: '전자제품',
  kitchen: '주방용품',
};

export const searchCategories = [
  { icon: <Key />, label: searchCategoryLabels.personal, color: 'foggyBlue' },
  { icon: <Tablet />, label: searchCategoryLabels.mobile, color: 'paleYellow' },
  { icon: <Laptop />, label: searchCategoryLabels.electronics, color: 'pink' },
  { icon: <Coffee />, label: searchCategoryLabels.kitchen, color: 'teal' },
];
