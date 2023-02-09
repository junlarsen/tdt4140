import { createUserSchema, loginUserSchema } from "./user.js";

export class UserController {
  #userService;

  constructor(userService) {
    this.#userService = userService;
  }

  async login(req, res) {
    const form = loginUserSchema.parse(req.body);
    const login = await this.#userService.login(form.email, form.password);
    if (typeof login === "object") {
      return res.status(401, login).json(login);
    }
    return res.status(200).json({
      jwt: login,
    });
  }

  async register(req, res) {
    const form = createUserSchema.parse(req.body);
    const user = await this.#userService.find(form.email);
    if (user !== null) {
      return res.sendStatus(409);
    }
    await this.#userService.create(form);
    res.sendStatus(201);
  }
}
