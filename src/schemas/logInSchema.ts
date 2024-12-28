import { z } from "zod";
export const logInSchema = z.object({
  identifier: z.string(), // username or email
  password: z.string(),
});
