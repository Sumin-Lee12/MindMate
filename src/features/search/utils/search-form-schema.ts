import { z } from 'zod';
export const searchFormSchema = z.object({
  name: z.string().min(1, { message: '물건 이름은 필수 입력 사항입니다.' }),
  category: z.string().min(1, { message: '카테고리는 필수 입력 사항입니다.' }),
  location: z.string().min(1, { message: '간략한 위치는 필수 입력 사항입니다.' }),
  description: z.string().optional(),
});

export type SearchFormSchema = z.infer<typeof searchFormSchema>;
