import React from 'react';
import { Modal as RNModal, View, TouchableOpacity, Text } from 'react-native';

/**
 * 공통 모달 컴포넌트
 * @param visible - 모달 표시 여부
 * @param onClose - 닫기 함수
 * @param children - 모달 내부에 들어갈 내용
 * @param className - 추가적인 스타일 클래스
 */
type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

const Modal = ({ visible, onClose, children, className = '' }: ModalProps) => {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className={`min-w-[70%] rounded-lg bg-white p-6 ${className}`}>
          {children}
          <TouchableOpacity onPress={onClose} className="mt-4 self-end">
            <Text className="text-blue font-bold">닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;
