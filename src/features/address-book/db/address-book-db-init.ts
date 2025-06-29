import { db } from '../../../lib/db/share-db-init';

export const addressBookDBinit = async () => {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    -- contact
    CREATE TABLE IF NOT EXISTS contact (
      id INTEGER PRIMARY KEY,
      name TEXT,
      phone_number TEXT,
      profile_image TEXT,
      memo TEXT,
      is_me INTEGER,
      created_at TEXT
    );

    -- tag
    CREATE TABLE IF NOT EXISTS tag (
      id INTEGER PRIMARY KEY,
      name TEXT,
      color TEXT
    );

    -- contact_tag (다대다 연결 테이블)
    CREATE TABLE IF NOT EXISTS contact_tag (
      id INTEGER PRIMARY KEY,
      contact_id INTEGER,
      tag_id INTEGER,
      FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
    );

    -- note_group (contact별 메모 그룹)
    CREATE TABLE IF NOT EXISTS note_group (
      group_id INTEGER PRIMARY KEY,
      contact_id INTEGER,
      title TEXT,
      FOREIGN KEY (contact_id) REFERENCES contact(id) ON DELETE CASCADE
    );

    -- note_item (메모 그룹 내부 아이템)
    CREATE TABLE IF NOT EXISTS note_item (
      item_id INTEGER PRIMARY KEY,
      group_id INTEGER,
      title TEXT,
      content TEXT,
      FOREIGN KEY (group_id) REFERENCES note_group(group_id) ON DELETE CASCADE
    );
    `);

  // console.log('✅ SQLite DB initialized (expo-sqlite/next)');
};
