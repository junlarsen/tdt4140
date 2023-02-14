import { expect, describe, it, beforeEach } from "vitest";
import request from "supertest";
import { createMockDatabase } from "../sqlite.js";
import { UserService } from "../user-service.js";
import { UserController } from "../user-controller.js";
import express from "express";

describe("user controller", async () => {
  let database;
  let service;
  let controller;
  let app;

  beforeEach(async () => {
    database = await createMockDatabase();
    service = new UserService(database);
    controller = new UserController(service);
    app = express();
    app.use(express.json());
    app.post("/api/users/", (req, res) => controller.register(req, res));
    app.post("/api/users/login/", (req, res) => controller.login(req, res));
  });

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
    await request(app)
      .post("/api/users/")
      .set("content-type", "application/json")
      .send({
        username: "Joe",
        password: "123",
        email: "joe@doe.com",
      });
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
    await request(app)
      .post("/api/users/")
      .set("content-type", "application/json")
      .send({
        username: "Joe",
        password: "123",
        email: "joe@doe.com",
      });
    const response = await request(app)
      .post("/api/users/login/")
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

  it("rejects invalid payloads", async () => {
    const wrongSchema = await request(app)
      .post("/api/users/")
      .send({ foo: 123 });
    expect(wrongSchema.status).toBe(400);

    const wrongLoginSchema = await request(app)
      .post("/api/users/login/")
      .send({ foo: 123 });
    expect(wrongLoginSchema.status).toBe(400);
  });
});
