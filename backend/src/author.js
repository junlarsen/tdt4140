import { z } from "zod";

export const authorSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const createAuthorSchema = authorSchema.omit({
  id: true,
});
