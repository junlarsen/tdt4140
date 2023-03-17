import { describe, expect, it, beforeEach } from "vitest";
import { adminOnly, withAuth } from "../middleware.js";
import { createMockDatabase } from "../sqlite.js";
import { UserService } from "../user-service.js";
import { GenreService } from "../genre-service.js";
import request from "supertest";
import express from "express";
import { AuthorService } from "../author-service.js";
import { BookController } from "../book-controller.js";
import { BookService } from "../book-service.js";

describe("book controller", () => {
  let database;
  let userService;
  let genreService;
  let authorService;
  let bookService;
  let controller;
  let app;
  let userJwt;
  let adminJwt;
  let genre;
  let author;

  beforeEach(async () => {
    database = await createMockDatabase();
    userService = new UserService(database);
    genreService = new GenreService(database);
    authorService = new AuthorService(database);
    bookService = new BookService(database, authorService, genreService);
    controller = new BookController(bookService);
    const auth = withAuth(userService);
    userJwt = (await userService.login("user@test.no", "user")).jwt;
    adminJwt = (await userService.login("admin@test.no", "admin")).jwt;
    author = await genreService.create({ name: "J.K. Rowling" });
    genre = await authorService.create({ name: "Horror" });
    app = express();
    app.use(express.json());
    app.post("/api/books/", auth, adminOnly, (req, res) =>
      controller.create(req, res),
    );
    app.get("/api/books/", (req, res) => controller.list(req, res));
    app.get("/api/books/most-recent/", (req, res) =>
      controller.listMostRecentBooks(req, res),
    );
  });

  it("can create new books by admins", async () => {
    const added = await request(app)
      .post("/api/books/")
      .set("authorization", `Token ${adminJwt}`)
      .send({
        title: "Harry Potter",
        description: "Some book about some wizardry",
        release_year: 2000,
        image: null,
        genres: [genre.id],
        authors: [author.id],
        goodreads_url: "https://www.goodreads.com/book/show/7670800-clementine",
      });
    expect(added.status).toEqual(201);
    expect(added.body).toStrictEqual({
      id: 1,
      title: "Harry Potter",
      release_year: 2000,
      description: "Some book about some wizardry",
      image: null,
      authors: [{ id: 1, name: "Horror" }],
      genres: [{ id: 1, name: "J.K. Rowling" }],
      goodreads_url: "https://www.goodreads.com/book/show/7670800-clementine",
      goodreads_rating: 0,
      averageRating: null,
      ratingCount: 0,
    });
  });

  it("does not allow creating books without author or genre", async () => {
    const noAuthor = await request(app)
      .post("/api/books/")
      .set("authorization", `Token ${adminJwt}`)
      .send({
        title: "Harry Potter",
        description: "Some book about some wizardry",
        release_year: 2000,
        image: null,
        genres: [genre.id],
        authors: [],
        goodreads_url: "https://www.goodreads.com/book/show/7670800-clementine",
      });
    expect(noAuthor.status).toEqual(400);
    const noGenre = await request(app)
      .post("/api/books/")
      .set("authorization", `Token ${adminJwt}`)
      .send({
        title: "Harry Potter",
        description: "Some book about some wizardry",
        release_year: 2000,
        image: null,
        genres: [],
        authors: [author.id],
        goodreads_url: "https://www.goodreads.com/book/show/7670800-clementine",
      });
    expect(noGenre.status).toEqual(400);
  });

  it("can list the books that are registered", async () => {
    const empty = await request(app).get("/api/books/");
    expect(empty.status).toEqual(200);
    expect(empty.body).toEqual([]);
    await bookService.create({
      title: "Harry Potter",
      description: "Some book about some wizardry",
      releaseYear: 2000,
      image: "google.com/image",
      genres: [genre.id],
      authors: [author.id],
      goodreads_url: "https://www.goodreads.com/book/show/7670800-clementine",
    });
    const filled = await request(app).get("/api/books/");
    expect(filled.status).toEqual(200);
    expect(filled.body).toHaveLength(1);
  });

  it("should list the most recent book", async () => {
    await bookService.create({
      title: "Harry Potter",
      description: "Some book about some wizardry",
      releaseYear: 2000,
      image: "google.com/image",
      genres: [genre.id],
      authors: [author.id],
      goodreads_url: "https://www.goodreads.com/book/show/7670800-clementine",
    });
    const book = await bookService.create({
      title: "Harry Potter 2",
      description: "Some book about some wizardry",
      releaseYear: 2003,
      image: "google.com/image",
      genres: [genre.id],
      authors: [author.id],
      goodreads_url: "https://www.goodreads.com/book/show/7670800-clementine",
    });
    const newest = await request(app).get("/api/books/most-recent/");
    expect(newest.body[0]).toHaveProperty("id", book.id);
  });
});
