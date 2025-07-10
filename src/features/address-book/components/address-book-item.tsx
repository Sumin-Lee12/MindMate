import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import CommonBox from '../../../components/ui/common-box';
import AddressBookName from './address-book-name';
import { EllipsisVertical } from 'lucide-react-native';
import AddressBookContent from './address-book-content';
import AddressBookImage from './address-book-image';
import { Contact } from '../types/address-book-type';
import { useRouter } from 'expo-router';
import ActionMenu from './action-menu';
import { deleteContact } from '../services/mutation-contact-data';
import CallButton from './call-button';
import MessageButton from './message-button';
import { useAsyncDataGet } from '../../../hooks/use-async-data-get';
import { getAllTags, getContactTags } from '../services/get-tag-data';
import AddressBookTag from './address-book-tag';
import EditAddressBookTagButton from './edit-address-book-tag-button';

const AddressBookItem = ({ contact, refetch }: { contact: Contact; refetch: () => void }) => {
  const router = useRouter();
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const getContactTagsUseCallBack = useCallback(() => getContactTags(contact.id), [contact.id]);
  const { data: tags } = useAsyncDataGet(getContactTagsUseCallBack);

  useEffect(() => {
    getAllTags().then((tags) => {
      console.log(tags);
    });
  }, [tags]);

  const handleEdit = () => {
    router.push(`/address-book/edit/${contact.id}`);
  };

  const handleDelete = () => {
    deleteContact(contact.id.toString());
    setIsActionMenuVisible(false);
    refetch();
  };

  return (
    <CommonBox color="paleCobalt">
      <TouchableOpacity onPress={handleEdit}>
        {/* 상단 부분 */}
        <View className="flex-row justify-between">
          <View className="flex-row flex-wrap gap-1">
            {tags?.map((tag) => <AddressBookTag key={tag.id}>{tag.name}</AddressBookTag>)}
            <EditAddressBookTagButton />
          </View>
          <View className="flex-row items-start justify-between gap-2">
            <AddressBookName>{contact.name}</AddressBookName>
            <TouchableOpacity onPress={() => setIsActionMenuVisible(true)}>
              <View className="h-6 w-6 items-center justify-center">
                <EllipsisVertical size={25} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
          {isActionMenuVisible && (
            <ActionMenu
              isVisible={isActionMenuVisible}
              onClose={() => setIsActionMenuVisible(false)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </View>

        <View className="flex-row">
          {/* 프로필사진 컴포넌트 */}
          <View className="flex-[1] justify-center">
            <AddressBookImage />
          </View>

          {/* 텍스트 정보 */}
          <View className="flex-[2]">
            {/* 한줄 상세 설명 */}
            <AddressBookContent>{contact.memo}</AddressBookContent>

            {/* 버튼 */}
            <View className="mt-3 flex-row gap-2">
              <CallButton phoneNumber={contact.phone_number} />
              <MessageButton phoneNumber={contact.phone_number} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </CommonBox>
  );
};

export default AddressBookItem;

{
  /* 라벨 들어갈 위치 */
}
