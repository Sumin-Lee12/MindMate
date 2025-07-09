import { db } from '@/src/hooks/use-initialize-database';
import { NoteGroup } from '../types/address-book-type';

// 특정 연락처의 모든 메모 그룹 조회
export const getNoteGroupsByContactId = async (contactId: string): Promise<NoteGroup[]> => {
  try {
    const result = await db.getAllAsync<NoteGroup>(
      'SELECT * FROM note_group WHERE contact_id = ? ORDER BY group_id',
      [contactId],
    );

    return result;
  } catch (error) {
    console.error('❌ 메모 그룹 조회 실패:', error);
    throw error;
  }
};
