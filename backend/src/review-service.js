import { reviewSchema } from "./review.js";
import { bookSchema } from "./book.js";
import { userSchema } from "./user.js";

export class ReviewService {
    #database

    constructor(database) {
        this.#database = database;
    }

    async find(userid, bookid) {
        const review = await this.#database.get(
          `SELECT * FROM reviews WHERE reviews.user_id = $userid AND reviews.book_id = $bookid`,
          {
            $userid: userid,
            $bookid: bookid,
          },
        );
        return reviewSchema.parse({
          ...review
        });
    
    
    }

    async list() {
    }

    async create({userid, bookid, rating, comment}) {
        const review = await this.#database.get(
            "INSERT INTO reviews (user_id, book_id, rating, comment) VALUES ($userid, $bookid, $rating, $comment) RETURNING *",
            {
              $userid: userid,
              $bookid: bookid,
              $rating: rating,
              $comment: comment,
            },
        );
        return this.find(userid, bookid);
    }

}