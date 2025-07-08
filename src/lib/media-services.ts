import { db } from '../hooks/use-initialize-database';
import { MediaType } from '../types/common-db-types';
import * as ImagePicker from 'expo-image-picker';

type InsertMediaType = {
  media: MediaType[];
  owner_type: string;
  owner_id: number;
};

/**
 * sqlite에 미디어 저장 함수
 * @param media - [{uri : string, type : "image" | "video" | "livePhoto" | "pairedVideo" | undefined}] 미디어 배열
 * @param owner_type - 예: 'schedule', 'diary', 'contact'
 * @param owner_id - 해당 도메인 테이블의 고유 ID
 * @returns - 그대로 반환
 */
export const insertMedia = async (
  media: MediaType[],
  owner_type: string,
  owner_id: number,
): Promise<InsertMediaType> => {
  await Promise.all(
    media.map((item) =>
      db.runAsync(
        `
          INSERT INTO media (owner_type, owner_id, media_type, file_path)
          VALUES (?, ?, ?, ?)
        `,
        [owner_type, owner_id, item.type ?? null, item.uri],
      ),
    ),
  );
  return { media, owner_type, owner_id };
};

/**
 * 미디어 선택 함수
 * @returns - {uri : string, type : "image" | "video" | "livePhoto" | "pairedVideo" | undefined}
 */
export const pickMedia = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('시스템 설정에서 갤러리 접근 권한을 허용해 주세요.');
    return;
  }
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos', 'livePhotos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const type = result.assets[0].type;
      const newImage = { uri, type };
      return newImage;
    }
  } catch (error) {
    alert('이미지 업로드 에러');
  }
};
