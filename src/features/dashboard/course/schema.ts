import { z } from "zod";

export const CourseSchema = z.object({
    title: z.string().min(1, { message: "Required" }),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    price: z.number().optional(),
    categoryId: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof CourseSchema>;
