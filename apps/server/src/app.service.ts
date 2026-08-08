import { Injectable, Inject } from '@nestjs/common';
import { type Database } from './database/database.types';
import { sql } from 'drizzle-orm';

@Injectable()
export class AppService {
  constructor(@Inject('DATABASE') private readonly db: Database) {}

  async test(): Promise<{ status: string; database: string; error?: string }> {
    try {
      await this.db.execute(sql`SELECT 1`);
      return { status: 'test success', database: 'connected' };
    } catch (error: any) {
      return {
        status: 'test success',
        database: 'disconnected',
        error: error?.message,
      };
    }
  }
}
