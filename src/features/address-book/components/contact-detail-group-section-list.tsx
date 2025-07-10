import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { getNoteGroupsByContactId } from '../services/get-note-group-data';
import { NoteGroup, NoteItem } from '../types/address-book-type';
import { useAsyncDataGet } from '@/src/hooks/use-async-data-get';
import { getNoteItemsByGroupId } from '../services/get-note-group-data';
import CommonBox from '@/src/components/ui/common-box';
import Button from '@/src/components/ui/button';
import BottomModal from '@/src/components/ui/bottom-modal';
import { formTextStyle } from '../constants/style-class-constants';
import { createNoteItem } from '../services/mutation-note-group-data';

const ContactDetailGroupSectionList = ({
  id,
  isModalVisible,
}: {
  id: string;
  isModalVisible: boolean;
}) => {
  const getNoteGroupsByContactIdCallback = useCallback(async () => {
    const data = await getNoteGroupsByContactId(id);
    return data;
  }, [id]);
  const { data, refetch } = useAsyncDataGet<NoteGroup[]>(getNoteGroupsByContactIdCallback);

  useEffect(() => {
    refetch();
  }, [isModalVisible]);

  if (!data) return null;
  return (
    <ScrollView className="flex-1">
      {data.map((groupInfo) => {
        return <ContactDetailGroupList key={groupInfo.group_id} group={groupInfo} />;
      })}
    </ScrollView>
  );
};

const ContactDetailGroupList = ({ group }: { group: NoteGroup }) => {
  const getNoteItemsByGroupIdCallback = useCallback(async () => {
    const data = await getNoteItemsByGroupId(group.group_id.toString());
    return data;
  }, [group.group_id]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data, refetch } = useAsyncDataGet<NoteItem[]>(getNoteItemsByGroupIdCallback);

  useEffect(() => {
    refetch();
  }, [group, isModalVisible]);

  return (
    <View className="gap-2 p-4">
      <Text className="mb-2 text-sm font-normal">{group.title}</Text>
      {data?.map((item) => {
        return <ContactDetailGroupItem key={item.item_id} item={item} />;
      })}
      <AddContactDetailGroupItemButton onPress={() => setIsModalVisible(true)} />
      {isModalVisible && (
        <AddContactDetailGroupItemModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          groupId={group.group_id}
        />
      )}
    </View>
  );
};

const ContactDetailGroupItem = ({ item }: { item: NoteItem }) => {
  return (
    <CommonBox>
      <View className="gap-3">
        <Text className="text-sm font-normal">{item.content}</Text>
        <Text className="text-lg font-bold">{item.title}</Text>
      </View>
    </CommonBox>
  );
};

const AddContactDetailGroupItemButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button onPress={onPress}>
      <Text>+추가하기</Text>
    </Button>
  );
};

const AddContactDetailGroupItemModal = ({
  isModalVisible,
  setIsModalVisible,
  groupId,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  groupId: number;
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddContactDetailGroupItem = async () => {
    await createNoteItem(groupId.toString(), title, content);
  };

  return (
    <BottomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <View className="w-full px-10 pb-2 pt-4">
        <TextInput
          className={`text-md ${formTextStyle}`}
          value={title}
          onChangeText={setTitle}
          placeholder="제목을 입력하세요"
        />
        <TextInput
          className={`text-md ${formTextStyle}`}
          value={content}
          onChangeText={setContent}
          placeholder="설명을 입력하세요"
        />
      </View>
      <View className="w-full px-10 pb-4">
        <Button onPress={handleAddContactDetailGroupItem}>
          <Text>목록추가</Text>
        </Button>
      </View>
    </BottomModal>
  );
};

export default ContactDetailGroupSectionList;
