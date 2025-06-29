import { db } from '../../../lib/db/share-db-init';

export const routineDbInit = async () => {
  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS routines (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    details TEXT,
    image_url TEXT,
    repeat_cycle TEXT NOT NULL,
    alarm_time TEXT,
    deadline TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS routine_executions (
    id INTEGER PRIMARY KEY,
    routine_id INTEGER NOT NULL,
    execution_date TEXT NOT NULL,
    scheduled_date TEXT NOT NULL,
    status TEXT NOT NULL,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routines(id)
  );

  CREATE TABLE IF NOT EXISTS subtasks (
    id INTEGER PRIMARY KEY,
    routine_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    is_completed INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routines(id)
  );

  CREATE TABLE IF NOT EXISTS subtasks_executions (
    id INTEGER PRIMARY KEY,
    sub_task_id INTEGER NOT NULL,
    routine_execution_id INTEGER NOT NULL,
    is_completed INTEGER DEFAULT 0,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (sub_task_id) REFERENCES subtasks(id),
    FOREIGN KEY (routine_execution_id) REFERENCES routine_executions(id)
  );

  CREATE TABLE IF NOT EXISTS routine_statistics (
    id INTEGER PRIMARY KEY,
    routine_id TEXT NOT NULL,
    year INTEGER,
    month INTEGER,
    total_scheduled INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    total_skipped INTEGER DEFAULT 0,
    total_failed INTEGER DEFAULT 0,
    completion_rate REAL DEFAULT 0.0,
    avg_completion_time REAL DEFAULT 0.0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routines(id)
  );
  `);
};
