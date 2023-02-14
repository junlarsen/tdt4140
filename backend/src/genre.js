import { z } from "zod";

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const createGenreSchema = genreSchema.omit({
  id: true,
});
