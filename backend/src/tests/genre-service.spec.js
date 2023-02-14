import { describe, expect, it, beforeEach } from "vitest";
import { createMockDatabase } from "../sqlite.js";
import { GenreService } from "../genre-service.js";

describe("genre service", async () => {
  let database;
  let service;

  beforeEach(async () => {
    database = await createMockDatabase();
    service = new GenreService(database);
  });

  it("can add new genres", async () => {
    const missing = await service.find("magic");
    expect(missing).toBe(null);
    const created = await service.create({ name: "magic" });
    expect(created).toStrictEqual({
      id: 1,
      name: "magic",
    });
    const found = await service.find("magic");
    expect(found).toStrictEqual(created);
  });

  it("cannot add two genres with the same name", async () => {
    await service.create({ name: "magic" });
    await expect(() => service.create({ name: "magic" })).rejects.toThrow();
  });

  it("can list genres", async () => {
    const empty = await service.list();
    expect(empty.length).toBe(0);
    await service.create({ name: "test" });
    const populated = await service.list();
    expect(populated).toStrictEqual([{ id: 1, name: "test" }]);
  });
});
