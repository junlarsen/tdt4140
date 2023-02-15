import { z } from "zod";

export const authorSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
});

export const createAuthorSchema = authorSchema.omit({
  id: true,
});
