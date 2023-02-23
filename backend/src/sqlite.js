import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs/promises";
import path from "path";

const sqlite = sqlite3.verbose();
export const database = await open({
  filename: "./db.sqlite",
  driver: sqlite.Database,
});

/**
 * Create a mocking in-memory database with all database migrations applied to
 * it.
 */
export async function createMockDatabase() {
  const database = await open({
    filename: ":memory:",
    driver: sqlite.Database,
  });
  await migrate(database, false, true);
  return database;
}

export async function migrate(database, log = true, skipSeeding = false) {
  const files = await fs.readdir("./migrations");
  for (const file of files) {
    const filePath = path.resolve("./migrations", file);
    const stats = await fs.stat(filePath);
    if (stats.isFile() && file.endsWith(".sql")) {
      if (
        skipSeeding &&
        file.includes("seed") &&
        !file.includes("users_seed")
      ) {
        continue;
      }

      const contents = await fs.readFile(filePath, "utf-8");
      if (log) {
        console.log(`Performing migration ${file}`);
      }
      await database.exec(contents);
    }
  }
}
