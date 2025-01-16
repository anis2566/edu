import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

import { db } from "@/lib/db"
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware"
import { sendNotification } from "@/services/notification-services"

export const answerRouter = new Hono()
    .post(
        "/:questionId",
        sessionMiddleware,
        zValidator("param", z.object({
            questionId: z.string()
        })),
        zValidator("json", z.object({
            answer: z.string().min(1, { message: "Answer is required" }),
        })),
        async (c) => {
            const { answer } = c.req.valid("json")
            const { questionId } = c.req.valid("param")
            const { userId, name } = c.get("user")

            try {
                const question = await db.question.findUnique({
                    where: {
                        id: questionId
                    },
                    include: {
                        user: {
                            include: {
                                pushSubscribers: true,
                            }
                        }
                    }
                })

                if (!question) {
                    return c.json({ error: "Question not found" }, 404)
                }

                await db.$transaction(async (tx) => {
                    await tx.questionAnswer.create({
                        data: {
                            questionId,
                            answer,
                            userId
                        }
                    })

                    await sendNotification({
                        webPushNotification: {
                            title: "New Answer",
                            body: `${name} has answered your question`,
                            subscribers: question.user.pushSubscribers,
                        },
                        knockNotification: {
                            trigger: "question-reply",
                            actor: {
                                id: userId,
                                name: name,
                            },
                            recipients: [question.user.id],
                            data: {
                                redirectUrl: `/user/questions`,
                            },
                        },
                    })
                })

                return c.json({ success: "Answer submitted" }, 200)
            } catch (error) {
                console.error(error)
                return c.json({ error: "Failed to answer question" }, 500)
            }
        }
    )
    .delete(
        "/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id");

            try {
                const answer = await db.questionAnswer.findUnique({ where: { id } });

                if (!answer) {
                    return c.json({ error: "Answer not found" }, 404);
                }

                await db.questionAnswer.delete({ where: { id } });

                return c.json({ success: "Answer deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to delete answer" }, 500);
            }
        }
    )