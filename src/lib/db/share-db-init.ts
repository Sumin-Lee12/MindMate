import { db } from '../../hooks/use-initialize-database';

export const shareDbInit = async () => {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY NOT NULL, 
      owner_type TEXT NOT NULL, -- 예: 'schedule', 'diary', 'contact'
      owner_id INTEGER NOT NULL, -- 해당 도메인 테이블의 고유 ID
      media_type TEXT NOT NULL, -- 'image' | 'video' | 'audio'
      file_path TEXT NOT NULL, -- 로컬 파일 경로
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
};
