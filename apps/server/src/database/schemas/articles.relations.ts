import { relations } from 'drizzle-orm';
import { articles } from './articles.schema';
import { users } from './users.schema';
import { categories } from './categories.schema';

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
}));
