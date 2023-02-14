import { authorSchema } from "./author.js";

export class AuthorService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async find(name) {
    const author = await this.#database.get(
      "SELECT * FROM authors WHERE name=$name",
      {
        $name: name,
      },
    );
    return author ? authorSchema.parse(author) : null;
  }

  async list() {
    const authors = await this.#database.all("SELECT * FROM authors");
    return authors.map(authorSchema.parse);
  }

  async create({ name }) {
    const author = await this.#database.get(
      "INSERT INTO authors (name) VALUES ($name) RETURNING *",
      {
        $name: name,
      },
    );
    return authorSchema.parse(author);
  }
}
