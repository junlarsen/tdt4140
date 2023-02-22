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
  averageRating: z.number().min(0).max(5).nullable(),
  ratingCount: z.number(),
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
