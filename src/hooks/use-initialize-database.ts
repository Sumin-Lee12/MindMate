import { useEffect } from 'react';
import { addressBookDbInit } from '../features/address-book/db/address-book-db-init';
import { diaryDbInit } from '../features/diary/db/diary-db-init';
import { routineDbInit } from '../features/routine/db/routine-db-init';
import { scheduleDbInit } from '../features/schedule/db/schedule-db-init';
import { shareDbInit } from '../lib/db/share-db-init';
import { searchDbInit } from '../features/search/db/search-db-init';

const createDb = async () => {
  await addressBookDbInit();
  await diaryDbInit();
  await routineDbInit();
  await scheduleDbInit();
  await shareDbInit();
  await searchDbInit();
};

export const useInitializeDatabase = () => {
  useEffect(() => {
    (async () => {
      try {
        await createDb();
        console.log('초기화 성공');
      } catch {
        console.log('DB 초기화 실패');
      }
    })();
  }, []);
};
