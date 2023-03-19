import { z } from "zod";
import { authorSchema } from "./author.js";
import { genreSchema } from "./genre.js";

export const bookSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  release_year: z.number(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  authors: z.array(authorSchema).min(1),
  genres: z.array(genreSchema).min(1),
  goodreads_rating: z.number().min(0).max(5),
  goodreads_url: z.string().url().nullable(),
  newspapers_rating: z.number().min(0).max(5),
  averageRating: z.number().min(0).max(5).nullable(), // computed
  ratingCount: z.number(), // computed
});

export const createBookSchema = bookSchema
  .omit({
    id: true,
    authors: true,
    genres: true,
    averageRating: true,
    ratingCount: true,
  })
  .extend({
    authors: z.number().array().min(1),
    genres: z.number().array().min(1),
  });
