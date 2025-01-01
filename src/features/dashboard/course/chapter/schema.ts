import { z } from "zod";

export const ChapterSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
    videoThumbnail: z.string().optional(),
    isFree: z.boolean().default(false),
});
export type ChapterSchemaType = z.infer<typeof ChapterSchema>;
