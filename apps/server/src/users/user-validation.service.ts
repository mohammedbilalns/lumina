import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/database/database.types';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class UserValidationService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private validationCache = new Map<
    string,
    { user: User; timestamp: number }
  >();
  private readonly CACHE_TTL = 30 * 1000; // 30 seconds

  async validateActiveUserId(userId: string): Promise<User> {
    // Check cache
    const cached = this.validationCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      this.checkUserStatus(cached.user);
      return cached.user;
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    this.checkUserStatus(user);

    // Update cache
    this.validationCache.set(userId, { user, timestamp: Date.now() });

    return user;
  }

  validateActiveUser(user: User | undefined): User {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    this.checkUserStatus(user);
    return user;
  }

  private checkUserStatus(user: User) {
    if (!user.isVerified) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Your account has been blocked');
    }
  }
}
