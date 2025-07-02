import { db } from '../../../hooks/use-initialize-database';

export const diaryDbInit = async () => {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS diaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      body TEXT,
      font TEXT,
      font_size INTEGER,
      audio_uri TEXT,
      mood TEXT,
      created_at TEXT,
      updated_at TEXT
    );
  `);
};
