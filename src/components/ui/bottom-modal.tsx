import { Modal, TouchableWithoutFeedback, View } from 'react-native';

const BottomModal = ({
  isModalVisible,
  setIsModalVisible,
  children,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <Modal
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
      transparent={true}
    >
      <View className="flex flex-1">
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View className="flex-1 bg-black/50"></View>
        </TouchableWithoutFeedback>
        <View className="h-auto items-center justify-between bg-white">{children}</View>
      </View>
    </Modal>
  );
};

export default BottomModal;
