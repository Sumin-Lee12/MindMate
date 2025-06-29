import { db } from '../../../lib/db/share-db-init';

export const searchDbInit = async () => {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY NOT NULL, 
    item_id INTEGER NOT NULL,
    image_url BLOB NOT NULL, 
    created_at TEXT DEFAULT (datetime('now')));
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
`);
};
