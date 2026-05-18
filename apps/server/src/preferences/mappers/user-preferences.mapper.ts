import type { UserPreference } from '@lumina/shared-types';
import { UserPreferencesWithCategory } from 'src/database/database.types';

export class UserPreferencesMapper {
  static toResponse(
    preferences: UserPreferencesWithCategory[],
  ): UserPreference[] {
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
