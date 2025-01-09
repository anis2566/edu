import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";

import { isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";

export const attachmentRouter = new Hono()
    .post(
        "/:chapterId",
        isAdmin,
        zValidator('param', z.object({
            chapterId: z.string().min(1, { message: "required" }),
        })),
        zValidator('json', z.object({
            title: z.string().min(1, { message: "required" }),
            url: z.string().min(1, { message: "required" }),
        })),
        async (c) => {
            const { chapterId } = c.req.valid("param");
            const { title, url } = c.req.valid("json");

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    return c.json({ error: "Chapter not found" }, 404);
                }

                await db.attachment.create({
                    data: { title, url, chapterId },
                });

                return c.json({ success: "Attachment created" }, 201);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .delete(
        "/:attachmentId",
        isAdmin,
        zValidator("param", z.object({
            attachmentId: z.string().min(1, { message: "required" }),
        })),
        async (c) => {
            const { attachmentId } = c.req.valid("param");

            try {
                const attachment = await db.attachment.findUnique({
                    where: { id: attachmentId },
                });

                if (!attachment) {
                    return c.json({ error: "Attachment not found" }, 404);
                }

                await db.attachment.delete({ where: { id: attachmentId } });

                return c.json({ success: "Attachment deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )