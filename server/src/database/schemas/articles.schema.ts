import { text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { categories } from './categories.schema';

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id')
    .references(() => users.id)
    .notNull(),
  categoryId: uuid('category_id')
    .references(() => categories.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp('deleted_at'),
});
