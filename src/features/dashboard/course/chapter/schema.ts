import { z } from "zod";

export const chapterSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
});
