import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as schema from './schemas/';

export const databaseProvider: Provider = {
  provide: 'DATABASE',

  inject: [ConfigService],

  useFactory: (configService: ConfigService) => {
    const dbUrl = configService.getOrThrow<string>('DATABASE_URL');

    const client = postgres(dbUrl, {
      ssl: true,
    });

    return drizzle(client, {
      schema,
    });
  },
};
