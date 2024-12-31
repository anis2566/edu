import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" });

export const CategorySchema = z.object({
    name: requiredString,
    description: z.string().optional(),
    imageUrl: requiredString,
    tags: z.array(z.string()).optional(),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;