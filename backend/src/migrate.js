import { database, migrate } from "./sqlite.js";

await migrate(database);
