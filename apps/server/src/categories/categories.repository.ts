import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { type Database } from 'src/database/database.types';
import { categories } from 'src/database/schemas';

@Injectable()
export class CategoriesRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ) {}

  async getCategories() {
    return await this.db.query.categories.findMany();
  }

  async findById(id: string) {
    return this.db.query.categories.findFirst({
      where: eq(categories.id, id),
    });
  }
}
