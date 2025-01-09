import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { ChapterSchema } from "@/features/dashboard/course/chapter/schema";

export const chapterRouter = new Hono()
    .post(
        '/',
        isAdmin,
        zValidator('json', z.object({
            title: z.string().min(1, { message: "required" }),
            courseId: z.string().min(1, { message: "required" }),
        })),
        async (c) => {
            const { title, courseId } = c.req.valid('json');

            try {
                const course = await db.course.findUnique({
                    where: { id: courseId },
                });

                if (!course) {
                    return c.json({ error: "Course not found" }, 404);
                }

                const lastChapter = await db.chapter.findFirst({
                    where: { courseId },
                    orderBy: { position: "desc" },
                });

                const position = lastChapter?.position || 0;

                await db.chapter.create({
                    data: {
                        title,
                        courseId,
                        position: position + 1,
                    },
                });

                return c.json({ success: "Chapter created" }, 201);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .put(
        "/reorder",
        isAdmin,
        zValidator('json', z.object({
            list: z.array(z.object({ id: z.string(), position: z.number() })),
        })),
        async (c) => {
            const { list } = c.req.valid('json');

            try {
                const transaction = list.map((item) => {
                    return db.chapter.update({
                        where: { id: item.id },
                        data: { position: item.position },
                    });
                });

                await db.$transaction(transaction);

                return c.json({ success: "Chapters reordered" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .put(
        "/:chapterId",
        isAdmin,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        zValidator('json', ChapterSchema),
        async (c) => {
            const { chapterId } = c.req.valid('param');
            const body = c.req.valid('json');

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    return c.json({ error: "Chapter not found" }, 404);
                }

                await db.chapter.update({
                    where: { id: chapterId },
                    data: body,
                });

                return c.json({ success: "Chapter updated" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .put(
        "/togglePublish/:chapterId",
        isAdmin,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        zValidator('json', z.object({ isPublished: z.boolean() })),
        async (c) => {
            const { chapterId } = c.req.valid('param');
            const body = c.req.valid('json');

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    return c.json({ error: "Chapter not found" }, 404);
                }

                await db.chapter.update({
                    where: { id: chapterId },
                    data: { isPublished: body.isPublished },
                });

                return c.json({ success: "Chapter published" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .delete(
        "/:chapterId",
        isAdmin,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        async (c) => {
            const { chapterId } = c.req.valid('param');

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    return c.json({ error: "Chapter not found" }, 404);
                }

                await db.chapter.delete({ where: { id: chapterId } });

                return c.json({ success: "Chapter deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .get(
        "/:chapterId",
        sessionMiddleware,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        async (c) => {
            const { chapterId } = c.req.valid('param');
            const userId = c.get('user').userId;

            try {

                const course = await db.course.findFirst({
                    where: {
                        chapters: {
                            some: { id: chapterId },
                        },
                    },
                    include: {
                        chapters: {
                            select: {
                                id: true,
                            },
                        },
                    },
                });

                if (!course) {
                    throw new Error("Course not found");
                }

                const purchased = await db.purchase.findUnique({
                    where: {
                        userId_courseId: {
                            userId,
                            courseId: course.id,
                        },
                    },
                });

                const isPurchased = !!purchased;

                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                    include: {
                        userProgress: {
                            where: {
                                userId,
                            },
                        },
                        attachments: true,
                        assignment: true
                    },
                });

                if (!chapter) {
                    throw new Error("Chapter not found");
                }

                const userProgress = chapter.userProgress[0];

                let previousChapter = null;
                if (chapter.position !== null) {
                    const pre = await db.chapter.findFirst({
                        where: {
                            position: chapter.position - 1,
                        },
                    });

                    if (pre) {
                        previousChapter = pre.id;
                    }
                }

                let nextChapter = null;
                if (chapter.position !== null && chapter.position < course.chapters.length - 1) {
                    const next = await db.chapter.findFirst({
                        where: {
                            position: chapter.position + 1,
                        },
                    });

                    if (next) {
                        nextChapter = next.id;
                    }
                }

                let isLocked = true;
                if (chapter.isFree || isPurchased) {
                    isLocked = false;
                }

                return c.json({ success: true, isPurchased, chapter, userProgress, previousChapter, nextChapter, isLocked, course }, 200);
            } catch (error) {
                console.error(error);
                return c.json({
                    success: false,
                    isPurchased: false,
                    chapter: null,
                    userProgress: null,
                    previousChapter: null,
                    nextChapter: null,
                    isLocked: true,
                    course: null,
                }, 500);
            }
        }
    )
    .put(
        "/toggleCompleted/:chapterId",
        sessionMiddleware,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        zValidator('json', z.object({ isCompleted: z.boolean() })),
        async (c) => {
            const { chapterId } = c.req.valid('param');
            const { isCompleted } = c.req.valid('json');

            const userId = c.get('user').userId;

            try {
                await db.userProgress.upsert({
                    where: {
                        userId_chapterId: {
                            userId,
                            chapterId,
                        },
                    },
                    update: {
                        isCompleted: isCompleted,
                    },
                    create: {
                        userId,
                        chapterId,
                        isCompleted: isCompleted,
                    },
                });

                return c.json({ success: `Chapter ${isCompleted ? "completed" : "uncompleted"}` }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )