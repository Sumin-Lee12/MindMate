import { db } from '../../../lib/db/share-db-init';

// schedules 테이블에 image_id 는 이미지 테이블에서 가져오는 정보인데,
// 공통 테이블이라 일단 FK처럼 이름인 image_id 라고만 적어논 상태입니다!

export const scheduleDbInit = async () => {
  await db.execAsync(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY NOT NULL,
      is_completed INTEGER DEFAULT 0,
      title TEXT,
      contents TEXT,
      time TEXT NOT NULL,
      location TEXT,
      companion TEXT,
      alarm_id TEXT NOT NULL,
      image_id TEXT NOT NULL
      created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS alarms (
        id INTEGER PRIMARY KEY NOT NULL,
        schedule_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time INTEGER NOT NULL,
        FOREIGN KEY (schedule_id) REFERENCES shedules(id)
        created_at TEXT DEFAULT (datetime('now'))
      );
  `);
};
