import { expect, describe, it } from "vitest";
import request from "supertest";
import { createMockDatabase } from "../sqlite.js";
import { UserService } from "../user-service.js";
import { UserController } from "../user-controller.js";
import express from "express";

describe("user controller", async () => {
  // Create mock in-memory database and run transactions on it
  const database = await createMockDatabase();
  const service = new UserService(database);
  const controller = new UserController(service);
  const app = express();
  app.use(express.json());
  app.post("/api/users/", controller.register.bind(controller));
  app.post("/api/users/login/", controller.login.bind(controller));

  it("can register new users via the api", async () => {
    const response = await request(app)
      .post("/api/users/")
      .set("content-type", "application/json")
      .send({
        username: "Joe",
        password: "123",
        email: "joe@doe.com",
      });
    expect(response.status).toBe(201);
  });

  it("will not allow two equal emails", async () => {
    const response = await request(app)
      .post("/api/users/")
      .set("content-type", "application/json")
      .send({
        username: "Joe",
        password: "123",
        email: "joe@doe.com",
      });
    expect(response.status).toBe(409);
  });

  it("will return a valid jwt on authentication", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .set("content-type", "application/json")
      .send({
        email: "joe@doe.com",
        password: "123",
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("jwt");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).not.toHaveProperty("password");
  });
});
