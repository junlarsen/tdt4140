import { z } from "zod";

export const reviewSchema = z.object({
  user_id: z.number(),
  book_id: z.number(),
  username: z.string().min(1), // computed
  rating: z.number().min(0).max(5),
  comment: z.string().min(1),
});

export const createReviewSchema = reviewSchema.omit({
  user_id: true,
  username: true,
});

export const deleteReviewSchema = reviewSchema.pick({
  user_id: true,
  book_id: true,
});
