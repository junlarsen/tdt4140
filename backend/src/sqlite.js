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
  await migrate(database);
  return database;
}

export async function migrate(database) {
  const files = await fs.readdir("./migrations");
  for (const file of files) {
    const filePath = path.resolve("./migrations", file);
    const stats = await fs.stat(filePath);
    if (stats.isFile() && file.endsWith(".sql")) {
      const contents = await fs.readFile(filePath, "utf-8");
      console.log(`Performing migration ${file}`);
      await database.run(contents, () => {
        console.log(`Executed SQL:\n${contents}\n`);
      });
    }
  }
}
