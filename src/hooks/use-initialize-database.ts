import { useEffect } from 'react';
import { addressBookDbInit } from '../features/address-book/db/address-book-db-init';
import { diaryDbInit } from '../features/diary/db/diary-db-init';
import { routineDbInit } from '../features/routine/db/routine-db-init';
import { scheduleDbInit } from '../features/schedule/db/schedule-db-init';
import { shareDbInit } from '../lib/db/share-db-init';
import { searchDbInit } from '../features/search/db/search-db-init';
import * as SQLite from 'expo-sqlite';

export let db: SQLite.SQLiteDatabase;

const createDb = async () => {
  db = await SQLite.openDatabaseAsync('MindMateDb.db');
  await shareDbInit();
  await addressBookDbInit();
  await diaryDbInit();
  await routineDbInit();
  await scheduleDbInit();
  await searchDbInit();
};

export const useInitializeDatabase = () => {
  useEffect(() => {
    (async () => {
      try {
        await createDb();
        console.log('초기화 성공');
      } catch (err) {
        console.log('DB 초기화 실패', err);
      }
    })();
  }, []);
};
