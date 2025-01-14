import { z } from "zod";

import { GENDER } from "@/constant";

export const UserSchema = z.object({
    name: z.string().min(1, { message: "required" }),
    gender: z.nativeEnum(GENDER).optional(),
    dob: z.date().optional(),
    phone: z.string().optional(),
    email: z.string().email().min(1, { message: "required" }),
    image: z.string().optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;