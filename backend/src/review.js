import { z } from "zod";

export const reviewSchema = z.object({
  user_id: z.number(),
  book_id: z.number(),
  rating: z.number().min(0).max(5),
  comment: z.string().min(1),
});

export const createReviewSchema = reviewSchema.omit({
  user_id: true,
});
