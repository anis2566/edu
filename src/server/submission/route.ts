import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { SubmissionStatus } from "@prisma/client";

import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { db } from "@/lib/db";
import { sendNotification } from "@/services/notification-services";
import { getAdmin } from "@/features/auth/server/action";

export const submissionRouter = new Hono()
    .post(
        "/",
        sessionMiddleware,
        zValidator("json", z.object({
            fileUrl: z.string().min(1, { message: "File is required" }),
            assignmentId: z.string().min(1, { message: "Assignment is required" }),
        })),
        async (c) => {
            const { fileUrl, assignmentId } = c.req.valid("json");
            const { userId, name } = c.get("user");

            try {
                const hasSubmitted = await db.submission.findFirst({
                    where: {
                        userId,
                        assignmentId,
                        status: SubmissionStatus.Pending
                    },
                });

                if (hasSubmitted) {
                    return c.json({ error: "You have already submitted this assignment" }, 400);
                }

                await db.$transaction(async (tx) => {
                    const submission = await db.submission.create({
                        data: {
                            fileUrl,
                            assignmentId,
                            userId,
                        },
                        include: {
                            user: {
                                include: {
                                    pushSubscribers: true,
                                }
                            }
                        }
                    });

                    const admin = await getAdmin()

                    await sendNotification({
                        webPushNotification: {
                            title: "New Assignment Submission",
                            body: `${name} has submitted an assignment`,
                            subscribers: admin.subscription,
                        },
                        knockNotification: {
                            trigger: "assignment",
                            actor: {
                                id: userId,
                                name: name,
                            },
                            recipients: [admin.adminId],
                            data: {
                                redirectUrl: `/dashboard/assignment`,
                            },
                        },
                    })
                })

                return c.json({ success: "Assignment submitted successfully" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to submit assignment" }, 500);
            }
        }
    )
    .get(
        "/user",
        sessionMiddleware,
        zValidator("query", z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            sort: z.string().optional(),
        })),
        async (c) => {
            const { userId } = c.get("user");
            const { page, limit, sort } = c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [submissions, totalCount] = await Promise.all([
                db.submission.findMany({
                    where: {
                        userId
                    },
                    include: {
                        assignment: {
                            include: {
                                chapter: {
                                    include: {
                                        course: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.submission.count({
                    where: {
                        userId
                    }
                })
            ])

            return c.json({ submissions, totalCount })
        }
    )
    .get(
        "/",
        isAdmin,
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

            const [submissions, totalCount] = await Promise.all([
                db.submission.findMany({
                    where: {
                        ...(query && {
                            user: {
                                name: {
                                    contains: query,
                                    mode: "insensitive"
                                }
                            }
                        })
                    },
                    include: {
                        assignment: {
                            include: {
                                chapter: {
                                    include: {
                                        course: true
                                    }
                                }
                            }
                        },
                        user: true
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.submission.count({
                    where: {
                        ...(query && {
                            user: {
                                name: {
                                    contains: query,
                                    mode: "insensitive"
                                }
                            }
                        })
                    }
                })
            ])

            return c.json({ submissions, totalCount })
        }
    )
    .put(
        "/:id",
        sessionMiddleware,
        isAdmin,
        zValidator("param", z.object({
            id: z.string(),
        })),
        zValidator("json", z.object({
            status: z.nativeEnum(SubmissionStatus),
            feedback: z.string(),
        })),
        async (c) => {
            const { id } = c.req.valid("param");
            const { status, feedback } = c.req.valid("json");
            const { userId, name } = c.get("user")

            try {
                const submission = await db.submission.findUnique({
                    where: { id },
                    include: {
                        user: {
                            include: {
                                pushSubscribers: true,
                            }
                        }
                    }
                });

                if (!submission) {
                    return c.json({ error: "Submission not found" }, 404);
                }

                await db.$transaction(async (tx) => {
                    await tx.submission.update({
                        where: { id },
                        data: { status, feedback }
                    });

                    await sendNotification({
                        webPushNotification: {
                            title: "Assignment Feedback",
                            body: `You have just received feedback of your assignment`,
                            subscribers: submission.user.pushSubscribers,
                        },
                        knockNotification: {
                            trigger: "assignment-reply",
                            actor: {
                                id: userId,
                                name: name,
                            },
                            recipients: [submission.userId],
                            data: {
                                redirectUrl: `/user/assignments`,
                            },
                        },
                    })
                })

                return c.json({ success: "Submission updated" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to update submission" }, 500);
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
                const submission = await db.submission.findUnique({ where: { id } });

                if (!submission) {
                    return c.json({ error: "Submission not found" }, 404);
                }

                await db.submission.delete({ where: { id } });

                return c.json({ success: "Submission deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to delete submission" }, 500);
            }
        }
    )
