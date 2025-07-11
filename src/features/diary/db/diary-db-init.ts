import { db } from '../../../hooks/use-initialize-database';

/**
 * 일기 DB 초기화 함수
 */
export const diaryDbInit = async () => {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    -- 테이블이 없으면 생성 (기본 구조만)
    CREATE TABLE IF NOT EXISTS diaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      body TEXT,
      created_at TEXT,
      updated_at TEXT
    );
  `);

  // 누락 가능성 있는 컬럼들 안전하게 추가
  const alterColumnSafely = async (
    column: string,
    type: string,
    defaultValue: string | number = '',
  ) => {
    try {
      let defaultValueStr = '';
      if (defaultValue !== '') {
        if (typeof defaultValue === 'number') {
          defaultValueStr = ` DEFAULT ${defaultValue}`;
        } else {
          defaultValueStr = ` DEFAULT '${defaultValue}'`;
        }
      }
      await db.execAsync(`ALTER TABLE diaries ADD COLUMN ${column} ${type}${defaultValueStr}`);
    } catch (err) {
      if (__DEV__) {
        console.log(`컬럼 '${column}' 추가 스킵 (이미 존재할 수 있음)`);
      }
    }
  };

  await alterColumnSafely('font', 'TEXT', 'default');
  await alterColumnSafely('font_size', 'INTEGER', 16);
  await alterColumnSafely('text_align', 'TEXT', 'left');
  await alterColumnSafely('text_color', 'TEXT');
  await alterColumnSafely('background_color', 'TEXT');
  await alterColumnSafely('audio_uri', 'TEXT');
  await alterColumnSafely('mood', 'TEXT');
  await alterColumnSafely('deleted_at', 'TEXT');
  await alterColumnSafely('is_favorite', 'INTEGER', 0);

  // 인덱스는 중복 없이 항상 재확인
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at);
    CREATE INDEX IF NOT EXISTS idx_diaries_mood ON diaries(mood);
    CREATE INDEX IF NOT EXISTS idx_diaries_title ON diaries(title);
    CREATE INDEX IF NOT EXISTS idx_diaries_deleted_at ON diaries(deleted_at);
    CREATE INDEX IF NOT EXISTS idx_diaries_is_favorite ON diaries(is_favorite);
  `);
};
