import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  user_role: z.enum(["u", "a"]),
});

export const createUserSchema = userSchema.omit({
  id: true,
  user_role: true,
});

export const loginUserSchema = userSchema.omit({
  id: true,
  username: true,
  user_role: true,
});
