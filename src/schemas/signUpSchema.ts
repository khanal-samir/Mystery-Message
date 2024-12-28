import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(15, "Username must be no more than 15 characters")
  .regex(/^[a-zA-Z0-9]{3,15}$/, "Username must not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }), // automatic regex
  password: z
    .string()
    .min(6, { message: "Password must be atleast six characters" }),
});
