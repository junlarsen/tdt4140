import { describe, expect, it, beforeEach } from "vitest";
import { createMockDatabase } from "../sqlite.js";
import { UserService } from "../user-service.js";
import express from "express";
import { adminOnly, withAuth } from "../middleware.js";
import request from "supertest";
import { AuthorController } from "../author-controller.js";
import { AuthorService } from "../author-service.js";

describe("author controller", () => {
  let database;
  let userService;
  let authorService;
  let controller;
  let app;
  let userJwt;
  let adminJwt;

  beforeEach(async () => {
    database = await createMockDatabase();
    userService = new UserService(database);
    authorService = new AuthorService(database);
    controller = new AuthorController(authorService);
    const auth = withAuth(userService);
    userJwt = (await userService.login("user@ibdb.ntnu.no", "user")).jwt;
    adminJwt = (await userService.login("admin@ibdb.ntnu.no", "admin")).jwt;
    app = express();
    app.use(express.json());
    app.get("/api/authors/", auth, (req, res) => controller.list(req, res));
    app.post("/api/authors/", auth, adminOnly, (req, res) =>
      controller.create(req, res),
    );
  });

  it("can create new authors by admins", async () => {
    const added = await request(app)
      .post("/api/authors/")
      .set("authorization", `Token ${adminJwt}`)
      .send({ name: "foo" });
    expect(added.status).toBe(201);
    expect(added.body).toStrictEqual({ name: "foo", id: 1 });
  });

  it("will not allow regular users to add authors", async () => {
    const added = await request(app)
      .post("/api/authors/")
      .set("authorization", `Token ${userJwt}`)
      .send({ name: "foo" });
    expect(added.status).toBe(403);
  });

  it("can list existing authors", async () => {
    const emptyResponse = await request(app)
      .get("/api/authors/")
      .set("authorization", `Token ${userJwt}`);
    expect(emptyResponse.status).toBe(200);
    expect(emptyResponse.body).toStrictEqual([]);
    await authorService.create({ name: "foo" });
    const populated = await request(app)
      .get("/api/authors/")
      .set("authorization", `Token ${userJwt}`);
    expect(populated.status).toBe(200);
    expect(populated.body).toStrictEqual([{ name: "foo", id: 1 }]);
  });

  it("rejects invalid payloads", async () => {
    const wrongSchema = await request(app)
      .post("/api/authors/")
      .set("authorization", `Token ${adminJwt}`)
      .send({ foo: 123 });
    expect(wrongSchema.status).toBe(400);
  });
});
