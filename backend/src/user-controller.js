import { createUserSchema, loginUserSchema, userDtoSchema } from "./user.js";

export class UserController {
  #userService;

  constructor(userService) {
    this.#userService = userService;
  }

  async login(req, res) {
    const form = loginUserSchema.parse(req.body);
    const login = await this.#userService.login(form.email, form.password);
    if (typeof login === "object" && "error" in login) {
      return res.status(401, login).json(login);
    }
    return res.status(200).json({
      jwt: login.jwt,
      user: userDtoSchema.parse(login.user),
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
