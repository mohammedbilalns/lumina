import { UserPreferencesWithCategory } from 'src/database/database.types';

export class UserPreferencesMapper {
  static toResponse(preferences: UserPreferencesWithCategory[]) {
    return preferences.map((preference) => ({
      id: preference.id,

      category: {
        id: preference.category.id,
        name: preference.category.name,
        slug: preference.category.slug,
      },
    }));
  }
}
