import fs from "node:fs";
import path from "node:path";
import {  eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/database/schemas";
import { categories } from "../src/database/schemas/categories.schema";
import { Database } from "src/database/database.types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function generateUniqueSlug(
  db: Database,
  name: string,
): Promise<string> {
  const baseSlug = slugify(name);

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function seedCategories() {
  const client = postgres(process.env.DATABASE_URL!);

  const db = drizzle(client, {
    schema,
  });

  try {
    const filePath = path.join(__dirname, "categories.txt");

    const fileContent = fs.readFileSync(filePath, "utf8");

    const categoryNames = fileContent
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    for (const name of categoryNames) {
      const slug = await generateUniqueSlug(db, name);

      await db.insert(categories).values({
        name,
        slug,
      });

      console.log(`Seeded: ${name} → ${slug}`);
    }

    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.end();
    process.exit(0);
  }
}

seedCategories();
