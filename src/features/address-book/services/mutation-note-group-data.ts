import { NoteGroup } from '@/src/features/address-book/types/address-book-type';
import { db } from '@/src/hooks/use-initialize-database';
import { getNoteGroupsByContactId } from './get-note-group-data';

// 노트 그룹 생성
export const createNoteGroup = async (contactId: string, title: string): Promise<NoteGroup> => {
  try {
    const result = await db.runAsync('INSERT INTO note_group (contact_id, title) VALUES (?, ?)', [
      contactId,
      title,
    ]);

    // 생성된 note_group 반환
    const newNoteGroup = await getNoteGroupsByContactId(result.lastInsertRowId.toString());
    return newNoteGroup[0];
  } catch (error) {
    console.error('노트 그룹 생성 실패:', error);
    throw error;
  }
};

// 노트 그룹 수정
export const updateNoteGroup = async (
  groupId: string,
  noteGroupData: Partial<NoteGroup>,
): Promise<NoteGroup> => {
  try {
    // 수정할 필드들만 동적으로 SQL 생성
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (noteGroupData.contact_id !== undefined) {
      updateFields.push('contact_id = ?');
      updateValues.push(noteGroupData.contact_id);
    }
    if (noteGroupData.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(noteGroupData.title);
    }

    if (updateFields.length === 0) {
      throw new Error('수정할 데이터가 없습니다.');
    }

    updateValues.push(groupId); // WHERE 조건용 group_id
    const sql = `UPDATE note_group SET ${updateFields.join(', ')} WHERE group_id = ?`;

    await db.runAsync(sql, updateValues);

    // 수정된 note_group 반환
    const updatedNoteGroup = await getNoteGroupsByContactId(groupId);
    return updatedNoteGroup[0];
  } catch (error) {
    console.error('노트 그룹 수정 실패:', error);
    throw error;
  }
};

// 노트 그룹 삭제 (CASCADE로 관련 note_item도 자동 삭제됨)
export const deleteNoteGroup = async (groupId: string): Promise<boolean> => {
  try {
    const result = await db.runAsync('DELETE FROM note_group WHERE group_id = ?', [groupId]);
    return result.changes > 0; // 삭제된 행이 있으면 true
  } catch (error) {
    console.error('노트 그룹 삭제 실패:', error);
    throw error;
  }
};

// 특정 연락처의 모든 노트 그룹 삭제
export const deleteNoteGroupsByContactId = async (contactId: string): Promise<boolean> => {
  try {
    const result = await db.runAsync('DELETE FROM note_group WHERE contact_id = ?', [contactId]);
    return result.changes > 0;
  } catch (error) {
    console.error('연락처별 노트 그룹 삭제 실패:', error);
    throw error;
  }
};

// 노트 그룹 전체 삭제 (개발용)
export const deleteAllNoteGroups = async (): Promise<boolean> => {
  try {
    const result = await db.runAsync('DELETE FROM note_group');
    return result.changes > 0;
  } catch (error) {
    console.error('전체 노트 그룹 삭제 실패:', error);
    throw error;
  }
};
