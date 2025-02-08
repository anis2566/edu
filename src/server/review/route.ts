import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { ReviewSchema } from "@/features/user/my-courses/schema";
import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";

export const reviewRouter = new Hono()
    .post(
        "/:courseId",
        sessionMiddleware,
        zValidator("param", z.object({ courseId: z.string() })),
        zValidator("json", ReviewSchema),
        async (c) => {
            const { courseId } = c.req.valid("param");
            const { rating, content } = c.req.valid("json");
            const { userId } = c.get("user");

            try {
                const course = await db.course.findUnique({
                    where: {
                        id: courseId
                    }
                })

                if (!course) {
                    return c.json({ error: "Course not found" }, 404);
                }

                const isPurchased = await db.purchase.findUnique({
                    where: {
                        userId_courseId: {
                            userId,
                            courseId: courseId
                        }
                    }
                })

                if (!isPurchased) {
                    return c.json({ error: "You must purchase the course to leave a review" }, 400);
                }

                const isReviewed = await db.review.findFirst({
                    where: {
                        userId,
                        courseId
                    }
                })

                if (isReviewed) {
                    return c.json({ error: "You have already reviewed this course" }, 400);
                }

                await db.$transaction(async (tx) => {
                    await tx.review.create({
                        data: {
                            userId,
                            courseId,
                            rating,
                            content
                        }
                    })
                    const currentTotalReview = course.totalReviews;
                    const currentRating = course.rating || 0;

                    const newTotalReview = currentTotalReview + 1;
                    const newRating =
                        Math.floor(
                            ((currentRating * currentTotalReview + rating) / newTotalReview) * 2
                        ) / 2;

                    await db.course.update({
                        where: { id: courseId },
                        data: { totalReviews: { increment: 1 }, rating: newRating },
                    });
                });

                return c.json({ success: "Review submitted" }, 200);
            } catch (error) {
                return c.json({ error: "Internal server error" }, 500);
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
                const review = await db.review.findUnique({ where: { id } });

                if (!review) {
                    return c.json({ error: "Review not found" }, 404);
                }

                await db.review.delete({ where: { id } });

                return c.json({ success: "Review deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to delete review" }, 500);
            }
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

            const [reviews, totalCount] = await Promise.all([
                db.review.findMany({
                    where: {
                        ...(query && {
                            user: {
                                name: {
                                    contains: query,
                                    mode: "insensitive"
                                }
                            }
                        }),
                    },
                    include: {
                        user: true,
                        course: {
                            select: {
                                title: true,
                            }
                        },
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.review.count({
                    where: {
                        ...(query && { content: { contains: query, mode: "insensitive" } }),
                    },
                }),
            ]);

            return c.json({ reviews, totalCount });
        }
    )
