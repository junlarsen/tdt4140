import { z } from "zod";

export const reviewSchema = z.object({
    user_id: z.number(),
    book_id: z.number(),
    rating: z.number(),
    comment: z.string().nullable()
});

export const createReviewSchema = reviewSchema.omit({
    user_id: true, 
    book_id: true
});