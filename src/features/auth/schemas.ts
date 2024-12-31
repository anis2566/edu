import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" });

export const SignUpSchema = z.object({
    name: requiredString.min(3, { message: "at least 3 characters long" }),
    email: requiredString.email({ message: "invalid email" }),
    password: requiredString.min(6, { message: "at least 6 characters long" }),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
    email: requiredString.email({ message: "invalid email" }),
    password: requiredString,
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;