import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schemas';
import { users } from './schemas';
import { InferSelectModel } from 'drizzle-orm';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export type User = InferSelectModel<typeof users>;
