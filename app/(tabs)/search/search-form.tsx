import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Button from '@/src/components/ui/button';
import { useState } from 'react';
import SearchLabelInput from '@/src/features/search/components/search-label-input';
import SearchCategoryPicker from '@/src/features/search/components/search-category-picker';
import ImageAddButton from '@/src/components/ui/image-button';
import { db } from '@/src/hooks/use-initialize-database';

const SearchForm = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setdescription] = useState('');

  // dropdown 상태
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([
    { label: '개인용품', value: '개인용품' },
    { label: '모바일', value: '모바일' },
    { label: '전자제품', value: '전자제품' },
    { label: '주방용품', value: '주방용품' },
  ]);

  const handleSubmit = async () => {
    if (!name || !category || !location || !description) {
      console.error('모든 필드를 입력해 주세요');
      return;
    }
    try {
      await db.runAsync(
        `
        INSERT INTO search (name, category, location, description)
        VALUES (?, ?, ?, ?)
      `,
        [name, category, location, description],
      );
      clenarSearchForm();
      console.log('Search form submitted successfully');
    } catch (error) {
      console.error('Error submitting search form:', error);
      return;
    }
  };

  // 폼 초기화 함수
  const clenarSearchForm = () => {
    setName('');
    setLocation('');
    setdescription('');
    setCategory(null);
    setOpen(false);
    setItems([
      { label: '개인용품', value: 'personal' },
      { label: '모바일', value: 'mobile' },
      { label: '전자기기', value: 'electronics' },
      { label: '주방용품', value: 'kitchen' },
    ]);
  };

  const handleAddImage = () => {
    console.log('Image button pressed');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 items-center justify-around bg-turquoise p-4">
            <SearchLabelInput
              label="물건 이름"
              placeholder="물건 이름을 입력해 주세요"
              value={name}
              onChangeText={setName}
            />

            <View className="z-10 mb-7 h-20 w-full items-start justify-center gap-2">
              <Text className="text-md text-paleCobalt">카테고리</Text>
              <SearchCategoryPicker
                open={open}
                value={category}
                items={items}
                setOpen={setOpen}
                setValue={setCategory}
                setItems={setItems}
              />
            </View>

            <SearchLabelInput
              label="간략한 위치"
              placeholder="간략한 위치를 입력해 주세요"
              value={location}
              onChangeText={setLocation}
            />

            <SearchLabelInput
              label="상세 위치"
              placeholder="상세 위치를 입력해 주세요"
              value={description}
              onChangeText={setdescription}
              className="h-32"
              multiline
            />

            <ImageAddButton onPress={handleAddImage} />

            <Button className="w-3/4 rounded-lg bg-blue-500 px-4 py-2" onPress={handleSubmit}>
              <Text className="text-center text-lg text-white">등록하기</Text>
            </Button>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SearchForm;
