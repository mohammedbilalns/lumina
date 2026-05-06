import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schemas';
import { users, userPreferences, categories } from './schemas';
import { InferSelectModel } from 'drizzle-orm';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export type User = InferSelectModel<typeof users>;

export type Category = InferSelectModel<typeof categories>;

export type UserPreferences = InferSelectModel<typeof userPreferences >;

export type UserPreferencesWithCategory = UserPreferences & {
  category: Category
}
