import {
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Button from '@/src/components/ui/button';
import { useState } from 'react';
import SearchLabelInput from '@/src/features/search/components/search-label-input';
import SearchCategoryPicker from '@/src/features/search/components/search-category-picker';
import { db } from '@/src/hooks/use-initialize-database';
import { searchCategoryLabels } from '@/src/features/search/constants/search-category-constants';
import { SearchCategoryLabel } from '@/src/features/search/db/search-db-types';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { SearchFormSchema, searchFormSchema } from '@/src/features/search/utils/search-form-schema';
import ImageButton from '@/src/components/ui/image-button';
import { MediaType } from '@/src/types/common-db-types';
import { insertMedia, pickMedia } from '@/src/lib/media-services';
import { insertSearch } from '@/src/features/search/search-services';

const SearchForm = () => {
  const router = useRouter();
  const [images, setImages] = useState<MediaType[]>([]);

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

  // 폼 제출 함수
  const handleFormSubmit = async (data: SearchFormSchema) => {
    try {
      await db.withTransactionAsync(async () => {
        const lastInsertRowId = await insertSearch(data);
        if (images.length > 0) {
          await insertMedia(images, 'search', lastInsertRowId);
        }
      });
      router.back();
    } catch (error) {
      console.error('폼 제출 오류:', error);
      return;
    }
  };

  // 이미지 추가 함수
  const handleAddImage = async () => {
    const newImage = await pickMedia();
    if (!newImage) return;
    setImages((prev) => [...prev, newImage]);
  };

  // 이미지 삭제
  const handleRemoveImage = (idx: number) => {
    return setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-turquoise px-4 pt-8">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View className="items-center">
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
              <View className={`z-10 mb-9 w-full items-start justify-center gap-2`}>
                <Text className="text-lg text-paleCobalt">카테고리</Text>
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
                      onPress={Keyboard.dismiss}
                      onChangeValue={(val) => onChange(val)}
                    />
                  )}
                />
                <View className="h-5">
                  {errors.category && (
                    <Text className="text-ss text-red-500">{errors.category.message}</Text>
                  )}
                </View>
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
                      className="my-0"
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
                    className="my-0"
                    multiline
                  />
                )}
              />

              <View className="mb-8 h-28 w-full items-start justify-center gap-2">
                <Text className="text-lg text-paleCobalt">사진 추가</Text>
                <View className="flex flex-row gap-2">
                  {images.map((image, idx) => (
                    <ImageButton
                      key={idx}
                      onPress={() => handleRemoveImage(idx)}
                      image={image.uri}
                    />
                  ))}
                  {images.length < 3 && <ImageButton onPress={handleAddImage} />}
                </View>
              </View>
            </View>
            <View className="w-full items-center bg-turquoise pb-6">
              <Button
                className="h-[50px] w-3/4 rounded-xl bg-paleCobalt "
                onPress={handleSubmit(handleFormSubmit)}
              >
                <Text className="text-center text-lg text-white">등록하기</Text>
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchForm;
