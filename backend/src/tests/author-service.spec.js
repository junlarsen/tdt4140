import { describe, expect, it, beforeEach } from "vitest";
import { createMockDatabase } from "../sqlite.js";
import { AuthorService } from "../author-service.js";

describe("author service", async () => {
  let database;
  let service;

  beforeEach(async () => {
    database = await createMockDatabase();
    service = new AuthorService(database);
  });

  it("can add new authors", async () => {
    const missing = await service.find("jk rowling");
    expect(missing).toBe(null);
    const created = await service.create({ name: "jk rowling" });
    expect(created).toStrictEqual({
      id: 1,
      name: "jk rowling",
    });
    const found = await service.find("jk rowling");
    expect(found).toStrictEqual(created);
  });

  it("cannot add two authors with the same name", async () => {
    await service.create({ name: "jo nesbø" });
    await expect(() => service.create({ name: "jo nesbø" })).rejects.toThrow();
  });

  it("can list authors", async () => {
    const empty = await service.list();
    expect(empty.length).toBe(0);
    await service.create({ name: "test" });
    const populated = await service.list();
    expect(populated).toStrictEqual([{ id: 1, name: "test" }]);
  });
});
