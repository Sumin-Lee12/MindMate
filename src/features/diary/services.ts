import { db } from '../../hooks/use-initialize-database';
import {
  DiaryTableType,
  MediaTableType,
  DiaryCreateDbPayloadType,
  DiaryUpdateDbPayloadType,
  MediaCreateDbPayloadType,
  DiaryWithMediaType,
  DiarySearchDbFilterType,
} from './db/diary-db-types';

/**
 * 일기 서비스 클래스
 */
export class DiaryService {
  /**
   * 모든 일기를 조회합니다
   * @returns 일기 목록 (최신순 정렬)
   */
  static async getAllDiaries(): Promise<DiaryTableType[]> {
    try {
      const result = await db.getAllAsync<DiaryTableType>(
        `SELECT * FROM diaries ORDER BY created_at DESC`,
      );
      return result || [];
    } catch (error) {
      console.error('일기 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 일기를 조회합니다
   * @param id - 일기 ID
   * @returns 일기 정보 또는 null
   */
  static async getDiaryById(id: number): Promise<DiaryTableType | null> {
    try {
      const result = await db.getFirstAsync<DiaryTableType>(`SELECT * FROM diaries WHERE id = ?`, [
        id,
      ]);
      return result || null;
    } catch (error) {
      console.error('일기 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 일기를 검색합니다 (필터 적용)
   * @param filter - 검색 필터 옵션
   * @returns 필터링된 일기 목록
   */
  static async searchDiaries(filter: DiarySearchDbFilterType): Promise<DiaryTableType[]> {
    try {
      let query = `SELECT DISTINCT d.* FROM diaries d`;
      const conditions: string[] = [];
      const params: any[] = [];

      // 미디어 포함 여부 체크를 위한 JOIN
      if (filter.hasMedia !== undefined) {
        query += ` LEFT JOIN media m ON m.owner_type = 'diary' AND m.owner_id = d.id`;
      }

      // 날짜 범위 필터
      if (filter.startDate) {
        conditions.push(`d.created_at >= ?`);
        params.push(filter.startDate);
      }
      if (filter.endDate) {
        conditions.push(`d.created_at <= ?`);
        params.push(filter.endDate);
      }

      // 기분 필터
      if (filter.mood) {
        conditions.push(`d.mood = ?`);
        params.push(filter.mood);
      }

      // 키워드 검색
      if (filter.keyword) {
        conditions.push(`(d.title LIKE ? OR d.body LIKE ?)`);
        params.push(`%${filter.keyword}%`, `%${filter.keyword}%`);
      }

      // 미디어 포함 필터
      if (filter.hasMedia === true) {
        conditions.push(`m.id IS NOT NULL`);
      } else if (filter.hasMedia === false) {
        conditions.push(`m.id IS NULL`);
      }

      // WHERE 절 추가
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      // 정렬
      const orderBy = filter.orderBy || 'created_at';
      const orderDirection = filter.orderDirection || 'DESC';
      query += ` ORDER BY d.${orderBy} ${orderDirection}`;

      // 페이지네이션
      if (filter.limit) {
        query += ` LIMIT ?`;
        params.push(filter.limit);
        if (filter.offset) {
          query += ` OFFSET ?`;
          params.push(filter.offset);
        }
      }

      const result = await db.getAllAsync<DiaryTableType>(query, params);
      return result || [];
    } catch (error) {
      console.error('일기 검색 실패:', error);
      throw error;
    }
  }

  /**
   * 새로운 일기를 생성합니다
   * @param input - 일기 생성 데이터
   * @returns 생성된 일기의 ID
   */
  static async createDiary(input: DiaryCreateDbPayloadType): Promise<number> {
    try {
      const now = new Date().toISOString();
      const result = await db.runAsync(
        `INSERT INTO diaries (
          title, body, font, font_size, text_align, text_color, 
          background_color, audio_uri, mood, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          input.title,
          input.body,
          input.font || 'default',
          input.fontSize || 16,
          input.textAlign || 'left',
          input.textColor || null,
          input.backgroundColor || null,
          input.audioUri || null,
          input.mood || null,
          now,
          now,
        ],
      );

      return result.lastInsertRowId;
    } catch (error) {
      console.error('일기 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 일기와 대표 미디어를 함께 조회합니다 (목록 화면용)
   * @returns 일기 목록과 첫 번째 미디어 정보
   */
  static async getAllDiariesWithMedia(): Promise<
    (DiaryTableType & { media_uri: string | null; media_type: string | null })[]
  > {
    try {
      const result = await db.getAllAsync<
        DiaryTableType & { media_uri: string | null; media_type: string | null }
      >(
        `SELECT d.*, m.file_path as media_uri, m.media_type
       FROM diaries d
       LEFT JOIN (
         SELECT owner_id, MIN(id) as min_id
         FROM media
         WHERE owner_type = 'diary'
         GROUP BY owner_id
       ) first_media ON first_media.owner_id = d.id
       LEFT JOIN media m ON m.id = first_media.min_id
       ORDER BY d.created_at DESC`,
      );
      return result || [];
    } catch (error) {
      console.error('일기+미디어 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 일기를 수정합니다
   * @param input - 일기 수정 데이터
   */
  static async updateDiary(input: DiaryUpdateDbPayloadType): Promise<void> {
    try {
      const now = new Date().toISOString();
      const updateFields: string[] = [];
      const params: any[] = [];

      // 업데이트할 필드 동적 생성
      if (input.title !== undefined) {
        updateFields.push('title = ?');
        params.push(input.title);
      }
      if (input.body !== undefined) {
        updateFields.push('body = ?');
        params.push(input.body);
      }
      if (input.font !== undefined) {
        updateFields.push('font = ?');
        params.push(input.font);
      }
      if (input.fontSize !== undefined) {
        updateFields.push('font_size = ?');
        params.push(input.fontSize);
      }
      if (input.textAlign !== undefined) {
        updateFields.push('text_align = ?');
        params.push(input.textAlign);
      }
      if (input.textColor !== undefined) {
        updateFields.push('text_color = ?');
        params.push(input.textColor);
      }
      if (input.backgroundColor !== undefined) {
        updateFields.push('background_color = ?');
        params.push(input.backgroundColor);
      }
      if (input.audioUri !== undefined) {
        updateFields.push('audio_uri = ?');
        params.push(input.audioUri);
      }
      if (input.mood !== undefined) {
        updateFields.push('mood = ?');
        params.push(input.mood);
      }

      updateFields.push('updated_at = ?');
      params.push(now);

      params.push(input.id);

      await db.runAsync(`UPDATE diaries SET ${updateFields.join(', ')} WHERE id = ?`, params);
    } catch (error) {
      console.error('일기 수정 실패:', error);
      throw error;
    }
  }

  /**
   * 일기를 삭제합니다
   * @param id - 삭제할 일기 ID
   */
  static async deleteDiary(id: number): Promise<void> {
    try {
      // media 테이블의 관련 데이터도 CASCADE로 자동 삭제됨
      await db.runAsync(`DELETE FROM diaries WHERE id = ?`, [id]);
    } catch (error) {
      console.error('일기 삭제 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 일기의 미디어 파일을 조회합니다
   * @param diaryId - 일기 ID
   * @returns 미디어 파일 목록
   */
  static async getMediaByDiaryId(diaryId: number): Promise<MediaTableType[]> {
    try {
      const result = await db.getAllAsync<MediaTableType>(
        `SELECT 
          id, 
          owner_type as ownerType, 
          owner_id as ownerId, 
          media_type as mediaType, 
          file_path as filePath, 
          created_at as createdAt
        FROM media 
        WHERE owner_type = 'diary' AND owner_id = ?`,
        [diaryId],
      );
      return result || [];
    } catch (error) {
      console.error('미디어 파일 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 일기와 미디어 정보를 함께 조회합니다
   * @param id - 일기 ID
   * @returns 일기와 미디어 정보
   */
  static async getDiaryWithMedia(id: number): Promise<DiaryWithMediaType | null> {
    try {
      const diary = await this.getDiaryById(id);
      if (!diary) return null;

      const media = await this.getMediaByDiaryId(id);
      return { ...diary, media };
    } catch (error) {
      console.error('일기 상세 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 미디어 파일을 추가합니다
   * @param input - 미디어 생성 데이터
   * @returns 생성된 미디어 ID
   */
  static async addMedia(input: MediaCreateDbPayloadType): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO media (owner_type, owner_id, media_type, file_path) 
         VALUES (?, ?, ?, ?)`,
        [input.ownerType, input.ownerId, input.mediaType, input.filePath],
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('미디어 추가 실패:', error);
      throw error;
    }
  }

  /**
   * 미디어 파일을 삭제합니다
   * @param id - 삭제할 미디어 ID
   */
  static async deleteMedia(id: number): Promise<void> {
    try {
      await db.runAsync(`DELETE FROM media WHERE id = ?`, [id]);
    } catch (error) {
      console.error('미디어 삭제 실패:', error);
      throw error;
    }
  }

  /**
   * 일기 통계를 조회합니다
   * @returns 전체 일기 수, 기분별 통계, 미디어 포함 일기 수
   */
  static async getDiaryStats(): Promise<{
    total: number;
    byMood: Record<string, number>;
    withMedia: number;
  }> {
    try {
      // 전체 일기 수
      const totalResult = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM diaries`,
      );

      // 기분별 통계
      const moodResult = await db.getAllAsync<{ mood: string; count: number }>(
        `SELECT mood, COUNT(*) as count FROM diaries WHERE mood IS NOT NULL GROUP BY mood`,
      );

      // 미디어 포함 일기 수
      const mediaResult = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(DISTINCT owner_id) as count FROM media WHERE owner_type = 'diary'`,
      );

      const byMood: Record<string, number> = {};
      moodResult?.forEach((row) => {
        byMood[row.mood] = row.count;
      });

      return {
        total: totalResult?.count || 0,
        byMood,
        withMedia: mediaResult?.count || 0,
      };
    } catch (error) {
      console.error('일기 통계 조회 실패:', error);
      throw error;
    }
  }
}
