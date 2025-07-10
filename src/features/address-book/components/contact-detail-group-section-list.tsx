import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getNoteGroupsByContactId } from '../services/get-note-group-data';
import { NoteGroup, NoteItem } from '../types/address-book-type';
import { useAsyncDataGet } from '@/src/hooks/use-async-data-get';
import { getNoteItemsByGroupId } from '../services/get-note-group-data';
import CommonBox from '@/src/components/ui/common-box';
import Button from '@/src/components/ui/button';
import BottomModal from '@/src/components/ui/bottom-modal';
import { formTextStyle } from '../constants/style-class-constants';
import {
  createNoteItem,
  deleteNoteItem,
  updateNoteItem,
} from '../services/mutation-note-group-data';
import { EllipsisVertical } from 'lucide-react-native';
import ActionMenu from './action-menu';

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

  return (
    <View className="gap-2 p-4">
      <Text className="mb-2 text-sm font-normal">{group.title}</Text>
      {data?.map((item) => {
        return <ContactDetailGroupItem key={item.item_id} item={item} refetch={refetch} />;
      })}
      <AddContactDetailGroupItemButton onPress={() => setIsModalVisible(true)} />
      {isModalVisible && (
        <EditContactDetailGroupItemModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          groupId={group.group_id}
          refetch={refetch}
        />
      )}
    </View>
  );
};

const ContactDetailGroupItem = ({ item, refetch }: { item: NoteItem; refetch: () => void }) => {
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleDeleteContactDetailGroupItem = async () => {
    await deleteNoteItem(item.item_id.toString());
    refetch();
  };

  //모달이 꺼졌을때 리패치 처리
  useEffect(() => {
    if (!isEditModalVisible) {
      refetch();
    }
  }, [isEditModalVisible]);

  return (
    <CommonBox>
      <View className="gap-3">
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold">{item.title}</Text>
          <TouchableOpacity onPress={() => setIsActionMenuVisible(true)}>
            <EllipsisVertical size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <Text className="text-sm font-normal">{item.content}</Text>
      </View>
      {isActionMenuVisible && (
        <ActionMenu
          isVisible={isActionMenuVisible}
          onClose={() => setIsActionMenuVisible(false)}
          onEdit={() => {
            setIsEditModalVisible(true);
          }}
          onDelete={handleDeleteContactDetailGroupItem}
        />
      )}
      {isEditModalVisible && (
        <EditContactDetailGroupItemModal
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          groupId={item.group_id}
          item={item}
          refetch={refetch}
        />
      )}
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

const EditContactDetailGroupItemModal = ({
  isModalVisible,
  setIsModalVisible,
  groupId,
  item,
  refetch,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  groupId: number;
  item?: NoteItem;
  refetch: () => void;
}) => {
  const [title, setTitle] = useState(item?.title || '');
  const [content, setContent] = useState(item?.content || '');

  const handleEditContactDetailGroupItem = async () => {
    if (item) {
      await updateNoteItem(item.item_id.toString(), {
        group_id: item.group_id,
        title,
        content,
      });
      refetch();
    } else {
      await createNoteItem(groupId.toString(), title, content);
      refetch();
    }
  };

  return (
    <BottomModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
      <View className="w-full px-10 pb-2 pt-4">
        <TextInput
          className={`text-md ${formTextStyle}`}
          value={title}
          onChangeText={setTitle}
          placeholder={item?.title || '제목을 입력하세요'}
        />
        <TextInput
          className={`text-md ${formTextStyle}`}
          value={content}
          onChangeText={setContent}
          placeholder={item?.content || '설명을 입력하세요'}
        />
      </View>
      <View className="w-full px-10 pb-4">
        <Button onPress={handleEditContactDetailGroupItem}>
          <Text>{item ? '수정하기' : '목록추가'}</Text>
        </Button>
      </View>
    </BottomModal>
  );
};

export default ContactDetailGroupSectionList;
