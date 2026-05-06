import { Injectable, Inject } from '@nestjs/common';
import { eq, or } from 'drizzle-orm';
import { type Database } from 'src/database/database.types';
import { users } from 'src/database/schemas';

interface UserCreationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passwordHash: string;
}

interface UpdateUserData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async findById(id: string) {
    return this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async findByEmailOrPhone(email: string, phone: string) {
    return this.db.query.users.findFirst({
      where: or(
        eq(users.email, email),

        eq(users.phone, phone),
      ),
    });
  }

  async findByCredential(credential: string) {
    return this.db.query.users.findFirst({
      where: or(
        eq(users.email, credential),

        eq(users.phone, credential),
      ),
    });
  }

  async createUser(
    data: UserCreationData & {
      passwordHash: string;
    },
  ) {
    const [user] = await this.db
      .insert(users)
      .values({ ...data, dateOfBirth: new Date(data.dateOfBirth) })
      .returning();
    return user;
  }

  async updateUser(userId: string, data: UpdateUserData) {
    const [user] = await this.db
      .update(users)
      .set({ ...data, dateOfBirth: new Date(data.dateOfBirth) })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async udpateRefreshToken(userId: string, refreshTokenHash: string) {
    await this.db
      .update(users)
      .set({
        refreshToken: refreshTokenHash,
      })
      .where(eq(users.id, userId));
  }

  async updatePassword(userId: string, passwordHash: string) {
    await this.db
      .update(users)
      .set({
        passwordHash,
      })
      .where(eq(users.id, userId))
      .returning();
  }
}
