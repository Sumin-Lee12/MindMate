// 기본 테이블 타입들
export type Contact = {
  id: number;
  name: string;
  phone_number: string;
  profile_image: string | null;
  memo: string;
  is_me: 0 | 1;
  created_at: string;
};

export type Tag = {
  id: number;
  name: string;
  color: string;
};

export type ContactTag = {
  id: number;
  contact_id: number;
  tag_id: number;
};

export type NoteGroup = {
  group_id: number;
  contact_id: number;
  title: string;
};

export type NoteItem = {
  item_id: number;
  group_id: number;
  title: string;
  content: string;
};

// 조인된 데이터 타입들 (실제 사용시 유용)
export type ContactWithTags = Contact & {
  tags?: Tag[];
};

export type NoteGroupWithItems = NoteGroup & {
  items?: NoteItem[];
};

export type ContactWithDetails = Contact & {
  tags?: Tag[];
  noteGroups?: NoteGroupWithItems[];
};
