import { useEffect } from 'react';
import { addressBookDbInit } from '../features/address-book/db/address-book-db-init';
import { diaryDbInit } from '../features/diary/db/diary-db-init';
import { routineDbInit } from '../features/routine/db/routine-db-init';
import { scheduleDbInit } from '../features/schedule/db/schedule-db-init';
import { searchDbInit } from '../lib/db/share-db-init';

const createDb = async () => {
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
      } catch {
        console.log('DB 초기화 실패');
      }
    })();
  }, []);
};
