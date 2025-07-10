import { Modal, TouchableWithoutFeedback, TouchableOpacity, View, Text } from 'react-native';

const ActionMenu = ({
  isVisible,
  onClose,
  onEdit,
  onDelete,
}: {
  isVisible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleEdit = () => {
    onEdit();
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
      {/* 배경 오버레이 */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/50">
          {/* 메뉴 컨테이너 */}
          <TouchableWithoutFeedback>
            <View className="mx-8 min-w-[150px] rounded-lg bg-white py-2">
              {/* 편집하기 */}
              <TouchableOpacity onPress={handleEdit} className="border-gray-200 border-b px-4 py-3">
                <Text className="text-gray-800 text-base">편집하기</Text>
              </TouchableOpacity>

              {/* 삭제하기 */}
              <TouchableOpacity onPress={handleDelete} className="px-4 py-3">
                <Text className="text-base text-red-500">삭제하기</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ActionMenu;
