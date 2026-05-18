import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schemas';
import { users, userPreferences, categories, articles } from './schemas';
import { InferSelectModel } from 'drizzle-orm';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export type User = InferSelectModel<typeof users>;

export type Category = InferSelectModel<typeof categories>;

export type Article = InferSelectModel<typeof articles>;

export type UserPreferences = InferSelectModel<typeof userPreferences>;

export type UserPreferencesWithCategory = UserPreferences & {
  category: Category;
};

export type ArticleWithRelations = Article & {
  author: Pick<User, 'id' | 'firstName' | 'lastName'>;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  viewerReactionType?: 'LIKE' | 'DISLIKE' | 'BLOCKED' | null;
};
