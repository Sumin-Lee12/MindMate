import { db } from '../../../hooks/use-initialize-database';
import { Contact } from '../types/address-book-type';

// 내 연락처만 가져오기
export const getMyContact = async (): Promise<Contact> => {
  try {
    const data = await db.getAllAsync<Contact>('SELECT * FROM contact WHERE is_me = 1');
    return data[0] || null; // 내 연락처는 하나만 있을 것이므로 첫 번째 항목 반환
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 다른 사람들의 연락처만 가져오기
export const getOthersContacts = async (): Promise<Contact[]> => {
  try {
    const data = await db.getAllAsync<Contact>('SELECT * FROM contact WHERE is_me = 0');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
