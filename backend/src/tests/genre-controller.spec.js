import { describe, expect, it, beforeEach } from "vitest";
import { createMockDatabase } from "../sqlite.js";
import { UserService } from "../user-service.js";
import express from "express";
import { adminOnly, withAuth } from "../middleware.js";
import request from "supertest";
import { GenreController } from "../genre-controller.js";
import { GenreService } from "../genre-service.js";

describe("genre controller", () => {
  let database;
  let userService;
  let genreService;
  let controller;
  let app;
  let userJwt;
  let adminJwt;

  beforeEach(async () => {
    database = await createMockDatabase();
    userService = new UserService(database);
    genreService = new GenreService(database);
    controller = new GenreController(genreService);
    const auth = withAuth(userService);
    userJwt = (await userService.login("user@ibdb.ntnu.no", "user")).jwt;
    adminJwt = (await userService.login("admin@ibdb.ntnu.no", "admin")).jwt;
    app = express();
    app.use(express.json());
    app.get("/api/genres/", auth, (req, res) => controller.list(req, res));
    app.post("/api/genres/", auth, adminOnly, (req, res) =>
      controller.create(req, res),
    );
  });

  it("can create new topics by admins", async () => {
    const added = await request(app)
      .post("/api/genres/")
      .set("authorization", `Token ${adminJwt}`)
      .send({ name: "foo" });
    expect(added.status).toBe(201);
    expect(added.body).toStrictEqual({ name: "foo", id: 1 });
  });

  it("will not allow regular users to add genres", async () => {
    const added = await request(app)
      .post("/api/genres/")
      .set("authorization", `Token ${userJwt}`)
      .send({ name: "foo" });
    expect(added.status).toBe(403);
  });

  it("can list existing genres", async () => {
    const emptyResponse = await request(app)
      .get("/api/genres/")
      .set("authorization", `Token ${userJwt}`);
    expect(emptyResponse.status).toBe(200);
    expect(emptyResponse.body).toStrictEqual([]);
    await genreService.create({ name: "foo" });
    const populated = await request(app)
      .get("/api/genres/")
      .set("authorization", `Token ${userJwt}`);
    expect(populated.status).toBe(200);
    expect(populated.body).toStrictEqual([{ name: "foo", id: 1 }]);
  });

  it("rejects invalid payloads", async () => {
    const wrongSchema = await request(app)
      .post("/api/genres/")
      .set("authorization", `Token ${adminJwt}`)
      .send({ foo: 123 });
    expect(wrongSchema.status).toBe(400);
  });
});
