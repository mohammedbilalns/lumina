import { uuid, index } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { articles } from './articles.schema';
import { timestamp } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';

export const reactionTypeEnum = pgEnum('reaction_type', [
  'LIKE',
  'DISLIKE',
  'BLOCKED',
]);

export const articleReactions = pgTable(
  'article_reactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id),
    articleId: uuid('article_id').references(() => articles.id),
    reactionType: reactionTypeEnum('reaction_type').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdReactionIdx: index('article_reactions_user_id_reaction_idx').on(
      table.userId,
      table.reactionType,
    ),
  }),
);
