import type { UserProfile } from '@lumina/shared-types';
import { User } from 'src/database/database.types';

export class UserMapper {
  static toUserResponse(user: User): { user: UserProfile } {
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth?.toISOString().split('T')[0] ?? null,
      },
    };
  }
}
