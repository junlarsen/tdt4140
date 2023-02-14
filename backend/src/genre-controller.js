import { createGenreSchema } from "./genre.js";

export class GenreController {
  #genreService;

  constructor(genreService) {
    this.#genreService = genreService;
  }

  async list(req, res) {
    const genres = await this.#genreService.list();
    res.json(genres);
  }

  async create(req, res) {
    const form = createGenreSchema.safeParse(req.body);
    if (!form.success) {
      return res.sendStatus(400);
    }
    const exists = await this.#genreService.find(form.data.name);
    if (exists !== null) {
      return res.sendStatus(409);
    }
    const genre = await this.#genreService.create({
      name: form.data.name,
    });
    res.status(201).json(genre);
  }
}
