import { Alert } from 'react-native';

type AlertType = {
  type: 'delete' | 'confirm';
  text1: string;
  text2?: string;
  onPress: () => void;
};

/**
 *
 * @param param0 {타입 : "delete" | "confirm", 제목, 부제목, 삭제시 함수}
 */
export const deleteAlert = ({ type, text1, text2, onPress }: AlertType) => {
  Alert.alert(
    text1,
    text2,
    [
      { text: '취소', style: 'cancel' },
      type === 'delete' ? { text: '삭제', onPress } : { text: '확인', onPress },
    ],
    { cancelable: false },
  );
};
