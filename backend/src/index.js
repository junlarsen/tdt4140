import express from "express";
import cors from "cors";
import { database } from "./sqlite.js";
import { UserService } from "./user-service.js";
import { UserController } from "./user-controller.js";
import { adminOnly, withAuth } from "./middleware.js";
import { GenreService } from "./genre-service.js";
import { GenreController } from "./genre-controller.js";
import { AuthorService } from "./author-service.js";
import { AuthorController } from "./author-controller.js";
import { BookService } from "./book-service.js";
import { BookController } from "./book-controller.js";
import { ReviewController } from "./review-controller.js";
import { ReviewService } from "./review-service.js";

const app = express();
const userService = new UserService(database);
const genreService = new GenreService(database);
const authorService = new AuthorService(database);
const bookService = new BookService(database, authorService, genreService);
const reviewService = new ReviewService(database);

const userController = new UserController(userService);
const genreController = new GenreController(genreService);
const authorController = new AuthorController(authorService);
const bookController = new BookController(bookService);
const reviewController = new ReviewController(reviewService);

const auth = withAuth(userService);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/", (req, res) => res.send("Hello world from Express"));

// UserController
app.post("/api/users/", (req, res) => userController.register(req, res));
app.post("/api/users/login/", (req, res) => userController.login(req, res));

// GenreController
app.get("/api/genres/", (req, res) => genreController.list(req, res));
app.post("/api/genres/", auth, adminOnly, (req, res) =>
  genreController.create(req, res),
);

// AuthorController
app.get("/api/authors/", (req, res) => authorController.list(req, res));
app.post("/api/authors", auth, adminOnly, (req, res) =>
  authorController.create(req, res),
);

// BookController
app.post("/api/books/", auth, adminOnly, (req, res) =>
  bookController.create(req, res),
);
app.get("/api/books/", (req, res) => bookController.list(req, res));
app.get("/api/books/highest-rated/", (req, res) =>
  bookController.listHighestRated(req, res),
);
app.get("/api/books/most-recent/", (req, res) =>
  bookController.listMostRecentBooks(req, res),
);
// app.post("/api/books/fetch-ratings", auth, adminOnly, (req, res) =>
//   bookController.updateGoodreadsRatings(req, res),
// );

//ReviewController
app.get("/api/reviews/", (req, res) => reviewController.list(req, res));
app.post("/api/reviews/", auth, (req, res) =>
  reviewController.create(req, res),
);

app.listen(3001);
