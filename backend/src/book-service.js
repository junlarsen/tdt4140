import { bookSchema } from "./book.js";
import { authorSchema } from "./author.js";
import { genreSchema } from "./genre.js";

export class BookService {
  #database;
  #authorService;
  #genreService;

  constructor(database, authorService, genreService) {
    this.#database = database;
    this.#authorService = authorService;
    this.#genreService = genreService;
  }

  async getAuthors(id) {
    const authors = await this.#database.all(
      `SELECT authors.name, authors.id FROM authors
       INNER JOIN books_on_authors ON authors.id = books_on_authors.author_id
       WHERE books_on_authors.book_id = $id`,
      {
        $id: id,
      },
    );

    return authors.map(authorSchema.parse);
  }

  async getGenres(id) {
    const genres = await this.#database.all(
      `SELECT genres.name, genres.id FROM genres
       INNER JOIN books_on_genres ON genres.id = books_on_genres.genre_id
       WHERE books_on_genres.book_id = $id`,
      {
        $id: id,
      },
    );

    return genres.map(genreSchema.parse);
  }

  async createBookOnAuthor({ bookId, authorId }) {
    await this.#database.run(
      "INSERT INTO books_on_authors (author_id, book_id) VALUES ($authorId, $bookId)",
      {
        $authorId: authorId,
        $bookId: bookId,
      },
    );
  }

  async createBookOnGenre({ bookId, genreId }) {
    await this.#database.run(
      "INSERT INTO books_on_genres (genre_id, book_id) VALUES ($genreId, $bookId)",
      {
        $genreId: genreId,
        $bookId: bookId,
      },
    );
  }

  async list() {
    const ids = await this.#database.all(`SELECT id FROM books`);
    return await Promise.all(ids.map((x) => this.find(x.id)));
  }

  async find(id) {
    const book = await this.#database.get(
      `SELECT * FROM books WHERE books.id = $id`,
      {
        $id: id,
      },
    );
    return bookSchema.parse({
      ...book,
      genres: await this.getGenres(book.id),
      authors: await this.getAuthors(book.id),
    });
  }

  async create({ title, releaseYear, description, image, genres, authors }) {
    const book = await this.#database.get(
      "INSERT INTO books (title, release_year, description, image) VALUES ($title, $releaseYear, $description, $image) RETURNING *",
      {
        $title: title,
        $releaseYear: releaseYear,
        $description: description,
        $image: image,
      },
    );
    for (const genre of genres) {
      await this.createBookOnGenre({ bookId: book.id, genreId: genre });
    }
    for (const author of authors) {
      await this.createBookOnAuthor({ bookId: book.id, authorId: author });
    }
    return this.find(book.id);
  }
}