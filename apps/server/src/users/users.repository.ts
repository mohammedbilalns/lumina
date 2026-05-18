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
  otpHash?: string;
  otpAttempts?: number;
  otpExpiresAt?: Date;
  isVerified?: boolean;
}

interface UpdateUserData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface UpdateSignupUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passwordHash: string;
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

  async findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findByPhone(phone: string) {
    return this.db.query.users.findFirst({
      where: eq(users.phone, phone),
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
      .values({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
      })
      .returning();
    return user;
  }

  async updateSignupOtp(
    userId: string,
    data: {
      otpHash: string | null;
      otpAttempts: number;
      otpExpiresAt: Date | null;
      isVerified?: boolean;
    },
  ) {
    const [user] = await this.db
      .update(users)
      .set({
        otpHash: data.otpHash,
        otpAttempts: data.otpAttempts,
        otpExpiresAt: data.otpExpiresAt,
        isVerified: data.isVerified,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
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

  async updateSignupUser(userId: string, data: UpdateSignupUserData) {
    const [user] = await this.db
      .update(users)
      .set({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        updatedAt: new Date(),
      })
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
    const [user] = await this.db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return user;
  }
}
