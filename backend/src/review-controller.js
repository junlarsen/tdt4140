import { reviewSchema } from "./review.js";

export class ReviewController{
    #reviewService;

    constructor(reviewService) {
      this.#reviewService = reviewService;
    }
  
     async list(req, res) {
       const reviews = await this.#reviewService.list();
       res.json(reviews);
    }
  
    async create(req, res) {
      const form = reviewSchema.safeParse(req.body);
      if (!form.success) {
        return res.sendStatus(400);
      }
      try {
        const review = await this.#reviewService.create({
          ...form.data,
          userid: form.data.user_id,
          bookid: form.data.book_id,
        });
        return res.status(201).json(review);
      } catch (err) {
        console.log(err)
        return res.sendStatus(500);
      }
    }
}