import {
  createReviewSchema,
  deleteReviewSchema,
  reviewSchema,
} from "./review.js";

export class ReviewController {
  #reviewService;

  constructor(reviewService) {
    this.#reviewService = reviewService;
  }

  async list(req, res) {
    const reviews = await this.#reviewService.list();
    res.json(reviews);
  }

  async create(req, res) {
    const form = createReviewSchema.safeParse(req.body);
    if (!form.success) {
      return res.sendStatus(400);
    }
    try {
      const review = await this.#reviewService.create({
        ...form.data,
        userId: req.user.id,
        bookId: form.data.book_id,
      });
      return res.status(201).json(review);
    } catch (err) {
      return res.sendStatus(500);
    }
  }

  async delete(req, res) {
    const form = deleteReviewSchema.safeParse(req.body);
    if (!form.success) {
      return res.sendStatus(400);
    }
    await this.#reviewService.delete({
      userId: form.data.user_id,
      bookId: form.data.book_id,
    });
    return res.sendStatus(204);
  }
}
