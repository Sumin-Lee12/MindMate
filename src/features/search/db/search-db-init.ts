import { db } from '../../../hooks/use-initialize-database';

export const searchDbInit = async () => {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS search (
      id INTEGER PRIMARY KEY NOT NULL, 
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
};
