import BottomModal from '@/src/components/ui/bottom-modal';
import { useAsyncDataGet } from '@/src/hooks/use-async-data-get';
import { Plus } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import AddressBookTag from './address-book-tag';
import { getAllTags, getContactTags } from '../services/get-tag-data';
import Button from '@/src/components/ui/button';
import { Tag } from '../types/address-book-type';
import ActionMenu from './action-menu';
import { formTextStyle } from '../constants/style-class-constants';
import { updateTag } from '../services/mutation-tag-data';

const EditAddressBookTagButton = ({ refetch }: { refetch: () => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    refetch();
  }, [isModalVisible]);

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="rounded-full bg-turquoise px-2 py-0.5"
        style={{ minWidth: 24, minHeight: 24, justifyContent: 'center', alignItems: 'center' }}
      >
        <Plus size={16} color="#4A90E2" />
      </TouchableOpacity>
      {isModalVisible && (
        <SelectAddressBookTagModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          refetchItemTags={refetch}
        />
      )}
    </>
  );
};

const SelectAddressBookTagModal = ({
  isModalVisible,
  setIsModalVisible,
  refetchItemTags,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  refetchItemTags: () => void;
}) => {
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [tag, setTag] = useState<Tag | null>(null);
  const [isEditTag, setIsEditTag] = useState(false);

  const getAllTagsUseCallback = useCallback(getAllTags, []);
  const { data: allTags, refetch: refetchAllTags } = useAsyncDataGet(getAllTagsUseCallback);

  const refetch = useCallback(() => {
    refetchAllTags();
    refetchItemTags();
  }, [refetchAllTags, refetchItemTags]);

  console.log(allTags);

  const handleTag = (tag: Tag) => {
    //태그편집
    if (isEditTag) {
      setIsActionMenuVisible(true);
      setTag(tag);
      // refetch();
    }
    //태그선택
    if (!isEditTag) {
      // setIsEditTag(!isEditTag);
      // refetch();
    }
  };

  const handleEditTag = () => {
    setIsEditModalVisible(true);
  };

  return (
    <BottomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <View className="gap-10 p-4">
        <View className="flex-row flex-wrap gap-1">
          {allTags?.map((tag) => (
            <TouchableOpacity key={tag.id} onPress={() => handleTag(tag)}>
              <AddressBookTag>{tag.name}</AddressBookTag>
            </TouchableOpacity>
          ))}
        </View>
        <Button onPress={() => setIsEditTag(!isEditTag)}>
          <Text className="text-ss color-white">
            {isEditTag ? '태그 목록 수정완료' : '태그 목록 수정하기'}
          </Text>
        </Button>
      </View>
      {isActionMenuVisible && (
        <ActionMenu
          isVisible={isActionMenuVisible}
          onClose={() => setIsActionMenuVisible(false)}
          onEdit={handleEditTag}
          onDelete={() => {}}
        />
      )}
      {isEditModalVisible && tag && (
        <EditAddressBookTagModal
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          refetch={refetch}
          tag={tag}
        />
      )}
    </BottomModal>
  );
};

const EditAddressBookTagModal = ({
  isModalVisible,
  setIsModalVisible,
  tag,
  refetch,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  tag: Tag;
  refetch: () => void;
}) => {
  const [text, setText] = useState(tag.name || '');

  const handleEditTag = async () => {
    await updateTag(tag.id, { name: text });
    setIsModalVisible(false);
    refetch();
  };

  // const deleteTag = async () => {
  //   await
  //   setIsModalVisible(false);
  //   refetch();
  // };

  return (
    <BottomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <View className="gap-10 p-4">
        <TextInput
          className={`${formTextStyle} text-lg`}
          value={text}
          onChangeText={setText}
          placeholder={tag.name || '태그 이름을 입력해주세요.'}
        />
      </View>
      <Button onPress={handleEditTag}>
        <Text className="text-ss color-white">태그 수정완료</Text>
      </Button>
    </BottomModal>
  );
};

export default EditAddressBookTagButton;
