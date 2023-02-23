import { describe, expect, it, beforeEach } from "vitest";
import { createMockDatabase } from "../sqlite.js";
import { UserService } from "../user-service.js";
import { adminOnly, withAuth } from "../middleware.js";
import request from "supertest";
import express from "express";

describe("auth middleware", () => {
  let database;
  let userService;
  let middleware;
  let userJwt;
  let adminJwt;
  let user;
  let app;

  beforeEach(async () => {
    database = await createMockDatabase();
    userService = new UserService(database);
    middleware = withAuth(userService);
    user = await userService.create({
      username: "pete",
      password: "123",
      email: "foo@doot.com",
    });
    adminJwt = (await userService.login("admin@test.no", "admin")).jwt;
    userJwt = (await userService.login("foo@doot.com", "123")).jwt;
    app = express();
    app.get("/", middleware, (req, res) => res.json(req.user).send());
    app.get("/admin", middleware, adminOnly, (req, res) =>
      res.send("Hello admin"),
    );
  });

  it("will allow existing users through", async () => {
    const response = await request(app)
      .get("/")
      .set("authorization", `Token ${userJwt}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "pete");
    expect(response.body).toHaveProperty("iat");
    expect(response.body).toHaveProperty("exp");
  });

  it("will not allow unauthorized users through", async () => {
    const response = await request(app)
      .get("/")
      .set("authorization", "Token fakeToken");
    expect(response.status).toBe(403);
  });

  it("will not allow requests withour header through", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(401);
  });

  it("will not allow users to hit admin routes", async () => {
    const userResponse = await request(app)
      .get("/admin")
      .set("authorization", `Token ${userJwt}`);
    expect(userResponse.status).toBe(403);
    const adminResponse = await request(app)
      .get("/admin")
      .set("authorization", `Token ${adminJwt}`);
    expect(adminResponse.status).toBe(200);
    expect(adminResponse.text).toEqual("Hello admin");
  });
});
