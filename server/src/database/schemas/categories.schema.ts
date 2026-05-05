import { varchar, uuid, pgTable } from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", {length:  100}).unique().notNull(),
    name: varchar("name", {length:  100}).unique().notNull()
  }
)
