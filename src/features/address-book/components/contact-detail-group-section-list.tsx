import { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { getNoteGroupsByContactId } from '../services/get-note-group-data';
import { NoteGroup } from '../types/address-book-type';
import { useAsyncDataGet } from '@/src/hooks/use-async-data-get';

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
    <View className="h-40 items-center justify-center">
      {data.map((groupInfo) => {
        return <ContactDetailGroupList key={groupInfo.group_id} group={groupInfo} />;
      })}
    </View>
  );
};

const ContactDetailGroupList = ({ group }: { group: NoteGroup }) => {
  return (
    <View className="h-40 items-center justify-center">
      <Text>{group.title}</Text>
    </View>
  );
};

export default ContactDetailGroupSectionList;
