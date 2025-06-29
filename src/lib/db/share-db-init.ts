import * as SQLite from 'expo-sqlite';

export let db: SQLite.SQLiteDatabase; // 전역에서 접근 가능하게 export

export const searchDbInit = async () => {
  db = await SQLite.openDatabaseAsync('MindMateDb.db');
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY NOT NULL, 
      owner_type TEXT NOT NULL, -- 예: 'schedule', 'diary', 'contact'
      ower_id INTEGER NOT NULL, -- 해당 도메인 테이블의 고유 ID
      media_type TEXT NOT NULL, -- 'image' | 'video' | 'audio'
      file_path TEXT NOT NULL, -- 로컬 파일 경로
`);
};

export const createDb = async () => {};
