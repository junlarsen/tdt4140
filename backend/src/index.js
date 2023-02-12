import express from "express";
import cors from "cors";
import { database } from "./sqlite.js";
import { UserService } from "./user-service.js";
import { UserController } from "./user-controller.js";

const app = express();
const userService = new UserService(database);
const userController = new UserController(userService);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/", (req, res) => res.send("Hello world from Express"));
app.post("/api/users/", (req, res) => userController.register(req, res));
app.post("/api/users/login/", (req, res) => userController.login(req, res));
app.listen(3001);
