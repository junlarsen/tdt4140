import { z } from "zod";

export const genreSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
});

export const createGenreSchema = genreSchema.omit({
  id: true,
});
