import { z } from "zod";

export const ChapterSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
    videoThumbnail: z.string().optional(),
    isFree: z.boolean().default(false),
});
export type ChapterSchemaType = z.infer<typeof ChapterSchema>;


export const AssignmentSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    fileUrl: z.string().min(1, { message: "required" }),
});
export type AssignmentSchemaType = z.infer<typeof AssignmentSchema>;
