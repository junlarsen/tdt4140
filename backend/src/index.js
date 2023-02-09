import express from "express";
import { database } from "./sqlite.js";
import { UserService } from "./user-service.js";
import { UserController } from "./user-controller.js";

const app = express();
const userService = new UserService(database);
const userController = new UserController(userService);

app.use(express.json());
app.get("/", (req, res) => res.send("Hello world from Express"));
app.post("/api/users/", (req, res) => userController.register(req, res));
app.listen(3001);
