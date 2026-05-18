import type { AuthResponse } from '@lumina/shared-types';
import { User } from 'src/database/database.types';

export class AuthMapper {
  static toAuthResponse(
    user: User,
    accessToken: string,
    refreshToken: string,
  ): AuthResponse {
    return {
      accessToken,
      refreshToken,
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
