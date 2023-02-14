import { expect, describe, it, beforeEach } from "vitest";
import { UserService } from "../user-service.js";
import { createMockDatabase } from "../sqlite.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const sign = promisify(jwt.sign);

describe("user service", async () => {
  let database;
  let service;

  beforeEach(async () => {
    database = await createMockDatabase();
    service = new UserService(database);
  });

  it("should register new users", async () => {
    const user = await service.create({
      username: "John Doe",
      password: "123",
      email: "john@example.com",
    });
    // Do not compare password, because the hash is partially random
    expect(user).toHaveProperty("username", "John Doe");
    expect(user).toHaveProperty("user_role", "u");
    expect(user).toHaveProperty("email", "john@example.com");
  });

  it("should not allow registering the same email twice", async () => {
    await service.create({
      username: "Peter Griffin",
      password: "123",
      email: "peter@example.com",
    });
    await expect(() =>
      service.create({
        username: "Peter Griffin",
        password: "123",
        email: "peter@example.com",
      }),
    ).rejects.toThrowError();
  });

  it("should find existing users", async () => {
    const missing = await service.find("foo@example.com");
    expect(missing).toBe(null);
    const user = await service.create({
      username: "Peter Pan",
      password: "123",
      email: "foo@example.com",
    });
    const found = await service.find(user.email);
    expect(found).toStrictEqual(user);
  });

  it("should log in valid users", async () => {
    await service.create({
      username: "Peter Pan",
      password: "123",
      email: "foo@example.com",
    });
    const user = await service.login("foo@example.com", "123");
    expect(user).toBeDefined();
    const decoded = await service.decrypt(user.jwt);
    expect(decoded).not.toHaveProperty("password");
    expect(decoded).toHaveProperty("email", "foo@example.com");
  });

  it("should not log in missing or wrong passwords", async () => {
    const fake = await service.login("nobody@nobody.net", "admin");
    expect(fake).toStrictEqual({ error: "invalid_user" });
    await service.create({
      username: "Peter Pan",
      password: "123",
      email: "foo@example.com",
    });
    const wrong = await service.login("foo@example.com", "wrong_password");
    expect(wrong).toStrictEqual({ error: "invalid_password" });
  });

  it("should not return value for fake jwts", async () => {
    const randomJwt = await sign({ a: 123 }, "fake_password");
    const user = await service.decrypt(randomJwt);
    expect(user).toBeNull();
  });
});
