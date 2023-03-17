import { bookSchema } from "./book.js";
import { authorSchema } from "./author.js";
import { genreSchema } from "./genre.js";
import { load } from "cheerio";
import fetch from "node-fetch";

export class BookService {
  #database;
  #authorService;
  #genreService;

  constructor(database, authorService, genreService) {
    this.#database = database;
    this.#authorService = authorService;
    this.#genreService = genreService;
  }

  async getHighestRatedBooks() {
    const all = await this.list();
    return all.sort((x, y) => y.averageRating - x.averageRating).slice(0, 8);
  }

  async getMostRecentBooks() {
    const all = await this.list();
    return all.sort((x, y) => y.release_year - x.release_year).slice(0, 8);
  }

  async getAverageRating(id) {
    const rating = await this.#database.get(
      `SELECT AVG(reviews.rating), COUNT(*) FROM reviews WHERE book_id = $bookId`,
      {
        $bookId: id,
      },
    );
    return {
      average: rating["AVG(reviews.rating)"],
      count: rating["COUNT(*)"],
    };
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

    const ratingStatistics = await this.getAverageRating(book.id);
    const fullBook = {
      ...book,
      genres: await this.getGenres(book.id),
      authors: await this.getAuthors(book.id),
      averageRating: ratingStatistics.average,
      ratingCount: ratingStatistics.count,
    };
    return bookSchema.parse(fullBook);
  }

  async create({
    title,
    releaseYear,
    description,
    image,
    genres,
    authors,
    goodreadsUrl,
  }) {
    const book = await this.#database.get(
      "INSERT INTO books (title, release_year, description, image, goodreads_url) VALUES ($title, $releaseYear, $description, $image, $goodreadsUrl) RETURNING *",
      {
        $title: title,
        $releaseYear: releaseYear,
        $description: description,
        $image: image,
        $goodreadsUrl: goodreadsUrl,
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

  async getAllGoodreadsRatings() {
    const books = await this.list();
    for (const book of books) {
      if (!book.goodreads_url) {
        continue;
      }
      const response = await fetch(book.goodreads_url);
      const body = await response.text();
      const cheerio = load(body);
      const matches = cheerio(".RatingStatistics__rating");
      if (matches.length < 1) {
        throw new Error(`Failed to get rating for book ${book.name}`);
      }
      const rating = matches.first().text();
      const value = parseFloat(rating);
      await this.#database.get(
        `UPDATE books SET goodreads_rating = $rating WHERE id = $id`,
        {
          $rating: value,
          $id: book.id,
        },
      );
    }
  }
}
