import { genreSchema } from "./genre.js";

export class GenreService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async find(name) {
    const genre = await this.#database.get(
      "SELECT * FROM genres WHERE name=$name",
      {
        $name: name,
      },
    );
    return genre ? genreSchema.parse(genre) : null;
  }

  async list() {
    const genres = await this.#database.all("SELECT * FROM genres");
    return genres.map(genreSchema.parse);
  }

  async create({ name }) {
    const genre = await this.#database.get(
      "INSERT INTO genres (name) VALUES ($name) RETURNING *",
      {
        $name: name,
      },
    );
    return genreSchema.parse(genre);
  }
}
