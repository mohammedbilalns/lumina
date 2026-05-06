import { User } from 'src/database/database.types';

export class UserMapper {
  static toUserResponse(user: User) {
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    };
  }
}
