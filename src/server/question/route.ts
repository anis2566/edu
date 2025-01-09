import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { db } from "@/lib/db";

export const questionRouter = new Hono()
    .post(
        "/:chapterId",
        sessionMiddleware,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        zValidator('json', z.object({ question: z.string().min(1, { message: "required" }) })),
        async (c) => {
            const { chapterId } = c.req.valid('param');
            const body = c.req.valid('json');
            const { userId } = c.get('user');

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    throw new Error("Chapter not found");
                }

                const question = await db.question.create({
                    data: {
                        question: body.question,
                        chapterId,
                        userId,
                    },
                    include: {
                        user: true,
                        answers: {
                            include: {
                                user: true,
                            }
                        }
                    },
                });

                return c.json({ success: "Question submitted", question, chapterId }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .get(
        "/home/:chapterId",
        zValidator("param", z.object({ chapterId: z.string() })),
        zValidator("query", z.object({ cursor: z.string().optional() })),
        async (c) => {
            const { chapterId } = c.req.valid("param");
            const { cursor } = c.req.valid("query") || undefined;

            const pageSize = 3;

            const questions = await db.question.findMany({
                where: { chapterId: chapterId },
                include: {
                    user: true,
                    answers: {
                        include: {
                            user: true,
                        }
                    }
                },
                orderBy: { createdAt: "desc" },
                take: -pageSize - 1,
                cursor: cursor ? { id: cursor } : undefined,
            });

            const previousCursor = questions.length > pageSize ? questions[0].id : null;

            console.log(previousCursor)

            const data = {
                questions: questions.length > pageSize ? questions.slice(1) : questions,
                previousCursor,
            };

            return c.json(data);
        }
    )
    .get(
        "/",
        zValidator("query", z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            sort: z.string().optional(),
            query: z.string().optional(),
        })),
        async (c) => {
            const { page, limit, sort, query } = c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [questions, totalCount] = await Promise.all([
                db.question.findMany({
                    where: {
                        ...(query && {
                            user: {
                                name: {
                                    contains: query,
                                    mode: "insensitive",
                                }
                            }
                        })
                    },
                    include: {
                        user: true,
                        chapter: {
                            select: {
                                title: true,
                                course: {
                                    select: {
                                        title: true,
                                    }
                                }
                            }
                        },
                        answers: {
                            include: {
                                user: true,
                            }
                        }
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.question.count({
                    where: {
                        ...(query && {
                            user: {
                                name: {
                                    contains: query,
                                    mode: "insensitive",
                                }
                            }
                        })
                    },
                }),
            ]);

            return c.json({ questions, totalCount });
        }
    )
    .delete(
        "/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const id = await c.req.param("id");

            try {
                const question = await db.question.findUnique({ where: { id } });

                if (!question) {
                    return c.json({ error: "Question not found" }, 404);
                }

                await db.question.delete({ where: { id } });

                return c.json({ success: "Question deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to delete question" }, 500);
            }
        }
    )