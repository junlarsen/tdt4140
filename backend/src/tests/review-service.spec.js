import { describe, expect, it, beforeEach } from "vitest";
import { ReviewService } from "../review-service";
import { createMockDatabase } from "../sqlite.js";
import { GenreService } from "../genre-service.js";
import { AuthorService } from "../author-service.js";
import { BookService } from "../book-service.js";
import { UserService } from "../user-service.js";

describe("review service", () => {
  let database;
  let genreService;
  let authorService;
  let bookService;
  let reviewService;
  let book;
  let user;

  beforeEach(async () => {
    database = await createMockDatabase();
    genreService = new GenreService(database);
    authorService = new AuthorService(database);
    bookService = new BookService(database);
    reviewService = new ReviewService(database);
    const userService = new UserService(database);

    user = await userService.find("user@ibdb.ntnu.no");
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
  });

  it("can create a review", async () => {
    const review = await reviewService.create({
      userId: user.id,
      bookId: book.id,
      rating: 4,
      comment: "This book was a nice read",
    });
    expect(review).toStrictEqual({
      user_id: user.id,
      book_id: book.id,
      rating: 4,
      comment: "This book was a nice read",
      username: user.username,
    });
    // The book should now have a new average rating
    const updatedBook = await bookService.find(book.id);
    expect(updatedBook).toHaveProperty("averageRating", 4);
    expect(updatedBook).toHaveProperty("ratingCount", 1);
  });

  it("can list reviews", async () => {
    const empty = await reviewService.list();
    expect(empty).toHaveLength(0);
    await reviewService.create({
      userId: 1,
      bookId: 1,
      rating: 4,
      comment: "This book was a nice read",
    });
    const one_review = await reviewService.list();
    expect(one_review).toHaveLength(1);
  });

  it("will not allow two reviews by the same person", async () => {
    await reviewService.create({
      userId: 1,
      bookId: 1,
      rating: 4,
      comment: "This book was a nice read",
    });
    await expect(() => {
      return reviewService.create({
        userId: 1,
        bookId: 1,
        rating: 4,
        comment: "This book was a nice read",
      });
    }).rejects.toThrowError();
  });
});
