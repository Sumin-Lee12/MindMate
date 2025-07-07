import { Keyboard, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import Button from '@/src/components/ui/button';
import { useState } from 'react';
import SearchLabelInput from '@/src/features/search/components/search-label-input';
import SearchCategoryPicker from '@/src/features/search/components/search-category-picker';
import ImageAddButton from '@/src/components/ui/image-button';
import { db } from '@/src/hooks/use-initialize-database';
import { searchCategoryLabels } from '@/src/features/search/constants/search-category-constants';
import { SearchCategoryLabel } from '@/src/features/search/db/search-db-types';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { SearchFormSchema, searchFormSchema } from '@/src/features/search/utils/search-form-schema';

const SearchForm = () => {
  const router = useRouter();

  // dropdown 상태
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SearchCategoryLabel[]>(
    Object.values(searchCategoryLabels).map((label) => ({ label, value: label })),
  );

  // react-hook-form 설정
  // zod를 이용한 유효성 검사
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      name: '',
      category: '',
      location: '',
      description: '',
    },
  });

  const handleFormSubmit = async (data: SearchFormSchema) => {
    try {
      await db.runAsync(
        `
        INSERT INTO search (name, category, location, description)
        VALUES (?, ?, ?, ?)
      `,
        [data.name, data.category, data.location, data.description ?? null],
      );
      router.back();
    } catch (error) {
      console.error('폼 제출 오류:', error);
      return;
    }
  };

  const handleAddImage = () => {
    console.log('Image button pressed');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-between bg-turquoise px-4">
          <View className="mt-8 flex-1 items-center">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <SearchLabelInput
                  label="물건 이름"
                  placeholder="물건 이름을 입력해 주세요"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errors={errors.name?.message}
                />
              )}
            />
            <View className={`z-10 my-5 h-20 w-full items-start justify-center gap-2`}>
              <Text className="text-md text-paleCobalt">카테고리</Text>
              <Controller
                name="category"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SearchCategoryPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={onChange}
                    setItems={setItems}
                    onChangeValue={(val) => onChange(val)}
                  />
                )}
              />
              {errors.category && (
                <Text className="text-ss text-red-500">{errors.category.message}</Text>
              )}
            </View>
            <View className="w-full">
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, value, onBlur } }) => (
                  <SearchLabelInput
                    label="간략한 위치"
                    placeholder="간략한 위치를 입력해 주세요"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errors={errors.location?.message}
                  />
                )}
              />
            </View>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <SearchLabelInput
                  label="상세 위치"
                  placeholder="상세 위치를 입력해 주세요"
                  value={value ?? ''}
                  onChangeText={onChange}
                  className="my-5 h-32"
                  multiline
                />
              )}
            />
            <View className="mb-5 w-full items-center">
              <ImageAddButton onPress={handleAddImage} />
            </View>
          </View>

          <View className="w-full flex-1 items-center">
            <Button
              className="w-3/4 rounded-lg bg-blue-500 px-4 py-2"
              onPress={handleSubmit(handleFormSubmit, (error) => {
                console.error('폼 제출 오류 (react-hook-form):', error);
                return;
              })}
            >
              <Text className="text-center text-lg text-white">등록하기</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default SearchForm;
