import { beforeEach, describe, expect, it } from "vitest";
import { ReviewController } from "../review-controller";
import { ReviewService } from "../review-service";
import { adminOnly, withAuth } from "../middleware.js";
import { createMockDatabase } from "../sqlite";
import express from "express";
import request from "supertest";
import { UserService } from "../user-service.js";
import { GenreService } from "../genre-service.js";
import { AuthorService } from "../author-service.js";
import { BookService } from "../book-service.js";
import { BookController } from "../book-controller.js";

describe("review contoller", () => {
  let database;
  let userService;
  let genreService;
  let authorService;
  let bookService;
  let reviewService;
  let controller;
  let app;
  let book;
  let user;
  let userJwt;

  beforeEach(async () => {
    database = await createMockDatabase();
    userService = new UserService(database);
    genreService = new GenreService(database);
    authorService = new AuthorService(database);
    bookService = new BookService(database, authorService, genreService);
    controller = new BookController(bookService);
    reviewService = new ReviewService(database);
    controller = new ReviewController(reviewService);
    const bookController = new BookController(bookService);
    userJwt = (await userService.login("user@test.no", "user")).jwt;
    user = await userService.find("user@test.no");
    const auth = withAuth(userService);
    const author = await authorService.create({ name: "John Doe" });
    const genre = await genreService.create({ name: "Romance" });
    book = await bookService.create({
      title: "My little pony",
      releaseYear: 2000,
      authors: [author.id],
      genres: [genre.id],
      description: "A book about ponies",
      image: null,
    });
    app = express();
    app.use(express.json());
    app.post("/api/reviews/", auth, (req, res) => controller.create(req, res));
    app.get("/api/reviews/", (req, res) => controller.list(req, res));
    app.get("/api/books/highest-rated/", (req, res) =>
      bookController.listHighestRated(req, res),
    );
  });

  it("test create a review", async () => {
    const added = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Token ${userJwt}`)
      .send({
        book_id: 1,
        rating: 4,
        comment: "This book was a clean read",
      });
    expect(added.status).toEqual(201);
    expect(added.body).toStrictEqual({
      user_id: user.id,
      book_id: 1,
      rating: 4,
      username: user.username,
      comment: "This book was a clean read",
    });
  });

  it("will not allow non-logged in users to review", async () => {
    const rejected = await request(app).post("/api/reviews/").send({
      user_id: user.id,
      book_id: 1,
      rating: 4,
      comment: "This book was a clean read",
    });
    expect(rejected.status).toEqual(401);
  });

  it("can list reviews that are registered", async () => {
    const empty = await request(app).get("/api/reviews/");
    expect(empty.status).toEqual(200);
    expect(empty.body).toEqual([]);
    await reviewService.create({
      userId: 2,
      bookId: 2,
      rating: 5,
      comment: "nice",
    });
    const filled = await request(app).get("/api/reviews/");
    expect(filled.status).toEqual(200);
    expect(filled.body).toHaveLength(1);
  });

  it("will show highest rated book", async () => {
    await reviewService.create({
      userId: 1,
      bookId: 1,
      rating: 4,
      comment: "This book was a nice read",
    });
    const highest = await request(app).get("/api/books/highest-rated/");
    expect(highest.body[0]).toHaveProperty("averageRating", 4);
  });
});
