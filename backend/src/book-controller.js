import { createBookSchema } from "./book.js";

export class BookController {
  #bookService;

  constructor(bookService) {
    this.#bookService = bookService;
  }

  async list(req, res) {
    const books = await this.#bookService.list();
    res.json(books);
  }

  async create(req, res) {
    const form = createBookSchema.safeParse(req.body);
    if (!form.success) {
      return res.sendStatus(400);
    }
    try {
      const book = await this.#bookService.create({
        ...form.data,
        releaseYear: form.data.release_year,
      });
      return res.status(201).json(book);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  }
}
