import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/database/database.types';

@Injectable()
export class UserValidationService {
  validateActiveUser(user: User | undefined): User {
    if (!user || !user.isVerified) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Your account has been blocked');
    }

    return user;
  }
}
