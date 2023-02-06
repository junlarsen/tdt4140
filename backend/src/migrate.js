import fs from "fs/promises";
import path from "path";
import { database } from "./sqlite.js";

const files = await fs.readdir("./migrations");
for (const file of files) {
  const filePath = path.resolve("./migrations", file);
  const stats = await fs.stat(filePath);
  if (stats.isFile() && file.endsWith(".sql")) {
    const contents = await fs.readFile(filePath, "utf-8");
    console.log(`Performing migration ${file}`);
    database.run(contents, () => {
      console.log(`Executed SQL:\n${contents}\n`);
    });
  }
}
