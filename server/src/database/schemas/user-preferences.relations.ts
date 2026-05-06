import { relations } from 'drizzle-orm';
import { userPreferences } from './user_preferences.schema';
import { users } from './users.schema';
import { categories } from './categories.schema';

export const userPreferencesRelations = relations(
  userPreferences,
  ({ one }) => ({
    user: one(users, {
      fields: [userPreferences.userId],
      references: [users.id],
    }),
    category: one(categories, {
      fields: [userPreferences.categoryId],
      references: [categories.id],
    }),
  }),
);
