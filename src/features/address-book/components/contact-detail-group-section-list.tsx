import { useCallback, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { getNoteGroupsByContactId } from '../services/get-note-group-data';
import { NoteGroup, NoteItem } from '../types/address-book-type';
import { useAsyncDataGet } from '@/src/hooks/use-async-data-get';
import { getNoteItemsByGroupId } from '../services/get-note-group-data';
import CommonBox from '@/src/components/ui/common-box';
import Button from '@/src/components/ui/button';

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

  const { data, refetch } = useAsyncDataGet<NoteItem[]>(getNoteItemsByGroupIdCallback);

  useEffect(() => {
    refetch();
  }, [group]);

  return (
    <View className="gap-2 p-4">
      <Text className="mb-2 text-sm font-normal">{group.title}</Text>
      {data?.map((item) => {
        return <ContactDetailGroupItem key={item.item_id} item={item} />;
      })}
      <AddContactDetailGroupItemButton />
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

const AddContactDetailGroupItemButton = () => {
  return (
    <Button>
      <Text>+추가하기</Text>
    </Button>
  );
};

export default ContactDetailGroupSectionList;
