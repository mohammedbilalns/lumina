import { Injectable, Inject } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { type Database } from "src/database/database.types";
import { userPreferences } from "src/database/schemas";


@Injectable()
export class PreferencesRepository {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database,
  ){}

  async fetchUserPreferences(userId: string) {
    return await this.db.query.userPreferences.findMany({
      where: eq(userPreferences.userId, userId),
    });
  }

  async saveUserPreferences(userId: string, preferences: string[]) {
    this.db.transaction(
      async (tx) => {
        await tx
        .delete(userPreferences)
        .where(eq(userPreferences.userId, userId));

        if(preferences.length == 0) {
          return []
        }

        return tx.insert(userPreferences).values(
          preferences.map((categoryId) => ({
            userId,
            categoryId
          }))
        )
      }
    )
  }
}
