import { integer, text, uuid, timestamp, index } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { categories } from './categories.schema';

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  featuredImage: text('featured_image'),
  likesCount: integer('likes_count').default(0).notNull(),
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
}, (table) => ({
  authorIdIdx: index('articles_author_id_idx').on(table.authorId),
  categoryIdIdx: index('articles_category_id_idx').on(table.categoryId),
  createdAtIdx: index('articles_created_at_idx').on(table.createdAt),
  deletedAtIdx: index('articles_deleted_at_idx').on(table.deletedAt),
}));
