import { createAuthorSchema } from "./author.js";

export class AuthorController {
  #authorService;

  constructor(authorService) {
    this.#authorService = authorService;
  }

  async list(req, res) {
    const genres = await this.#authorService.list();
    res.json(genres);
  }

  async create(req, res) {
    const form = createAuthorSchema.safeParse(req.body);
    if (!form.success) {
      return res.sendStatus(400);
    }
    const exists = await this.#authorService.find(form.data.name);
    if (exists !== null) {
      return res.sendStatus(409);
    }
    const genre = await this.#authorService.create({
      name: form.data.name,
    });
    res.status(201).json(genre);
  }
}
