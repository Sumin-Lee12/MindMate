import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Button } from 'react-native';

const shareDb = async () => {
  const dbUri = FileSystem.documentDirectory + 'MindMateDb.db';
  const exists = await FileSystem.getInfoAsync(dbUri);
  if (exists.exists) {
    await Sharing.shareAsync(dbUri);
  } else {
    console.warn('DB 파일이 존재하지 않음');
  }
};

export const DevDbShareButton = () => {
  return <Button title="내 DB 내보내기" onPress={shareDb} />;
};

export default DevDbShareButton;
