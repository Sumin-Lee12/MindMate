import { db } from '@/src/hooks/use-initialize-database';
import { SearchFormSchema } from './utils/search-form-schema';

export const fetchInsertSearch = async (data: SearchFormSchema) => {
  const { lastInsertRowId } = await db.runAsync(
    `
          INSERT INTO search (name, category, location, description)
          VALUES (?, ?, ?, ?)
        `,
    [data.name, data.category, data.location, data.description ?? null],
  );
  return lastInsertRowId;
};
