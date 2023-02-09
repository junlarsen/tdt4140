import { createUserSchema } from "./user.js";

export class UserController {
  #userService;

  constructor(userService) {
    this.#userService = userService;
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
