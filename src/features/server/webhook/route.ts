import { db } from "@/lib/db";
import { Hono } from "hono";

export const webhookRouter = new Hono()
    .post(
        "/vdoCipher",
        async (c) => {
            const data = await c.req.json();

            try {

                if (!data.payload) {
                    return c.json({ success: false, message: "Invalid payload" }, 400);
                }

                if (!data.payload.id || !data.payload.length) {
                    return c.json({ success: false, message: "Invalid payload" }, 400);
                }

                const chapter = await db.chapter.findFirst({
                    where: {
                        videoUrl: data.payload.id
                    }
                })

                if (!chapter) {
                    return c.json({ success: false, message: "Chapter not found" }, 404);
                }

                await db.$transaction(async (tx) => {
                    await tx.chapter.update({
                        where: {
                            id: data.payload.id
                        },
                        data: {
                            videoLength: data.payload.length
                        }
                    })
                    await tx.course.update({
                        where: {
                            id: chapter.courseId
                        },
                        data: {
                            length: {
                                increment: data.payload.length
                            }
                        }
                    })
                })
                return c.json({ success: true, message: "Webhook processed successfully" }, 200);
            } catch (error) {
                console.error("Error processing webhook:", error);
                return c.json({ success: false, message: "Error processing webhook" }, 500);
            }
        }
    )
