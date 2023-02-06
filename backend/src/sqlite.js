import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();
export const database = new sqlite.Database("./db.sqlite");
