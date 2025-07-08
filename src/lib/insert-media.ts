import { db } from '../hooks/use-initialize-database';
import { MediaType } from '../types/common-db-types';

type InsertMediaType = {
  media: MediaType[];
  owner_type: string;
  owner_id: number;
};

/**
 *
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
