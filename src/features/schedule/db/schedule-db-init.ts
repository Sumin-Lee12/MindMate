import { db } from '../../../hooks/use-initialize-database';

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
      image_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS alarms (
      id INTEGER PRIMARY KEY NOT NULL,
      schedule_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      time INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (schedule_id) REFERENCES schedules(id)
    );
  `);
};
