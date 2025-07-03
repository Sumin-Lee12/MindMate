// 일기 관련 타입 정의

export type DiaryItemType = {
  id: string;
  title: string;
  content: string;
  imageUri?: string;
  createdAt: string;
};

export type DiaryCreatePayloadType = Omit<DiaryItemType, 'id' | 'createdAt'>;
export type DiaryUpdatePayloadType = Partial<DiaryCreatePayloadType>;
