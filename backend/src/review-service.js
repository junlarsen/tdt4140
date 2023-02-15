import { reviewSchema } from "./review.js";
import { bookSchema } from "./book.js";
import { userSchema } from "./user.js";

export class ReviewService {
    #database

    constructor(database) {
        this.#database = database;
    }

    async getBooks(id) {
        const books = await this.#database.all(
            `SELECT books.title, books.id FROM books
            INNER JOIN reviews ON books.id = reviews.book_id
            WHERE reviews.user_id = $id`,
            {
                $id: id,
            },
        )
        return books.map(bookSchema.parse);
    }

    async getUsers(id) {
        const users = await this.#database.all(
            `SELECT users.title, users.id FROM users
            INNER JOIN reviews ON users.id = reviews.users_id
            WHERE reviews.books_id = $id`,
            {
                $id: id,
            },
        )
        return users.map(userSchema.parse)
    }

}