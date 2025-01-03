import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";
import { CourseSchema } from "../schema";

export const courseRouter = new Hono()
    .post(
        "/",
        isAdmin,
        zValidator("json", z.object({
            title: z.string(),
        })),
        async (c) => {
            const { title } = c.req.valid("json");

            try {
                const existingCourse = await db.course.findFirst({
                    where: {
                        title,
                    },
                });

                if (existingCourse) {
                    return c.json({ error: "Course already exists" }, 400);
                }

                const course = await db.course.create({
                    data: {
                        title,
                    },
                });

                return c.json({ success: "Course created", courseId: course.id }, 200);
            } catch (error) {
                return c.json({ error: "Failed to create course" }, 500);
            }
        }
    )
    .put(
        "/:id",
        isAdmin,
        zValidator("param", z.object({
            id: z.string(),
        })),
        zValidator("json", CourseSchema),
        async (c) => {
            const { id } = c.req.valid("param");
            const body = c.req.valid("json");

            try {
                const course = await db.course.findUnique({
                    where: { id },
                });

                if (!course) {
                    return c.json({ error: "Course not found" }, 404);
                }

                await db.course.update({
                    where: { id },
                    data: body,
                });

                return c.json({ success: "Course updated" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to update course" }, 500);
            }
        }
    )
    .get(
        "/categories",
        zValidator("query", z.object({
            query: z.string().optional(),
        })),
        async (c) => {
            const { query } = c.req.valid("query");
            const categories = await db.category.findMany({
                where: {
                    ...(query ? { name: { contains: query } } : {}),
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            });
            return c.json(categories);
        }
    )
    .put(
        "/togglePublish/:courseId",
        isAdmin,
        zValidator('param', z.object({ courseId: z.string().min(1, { message: "required" }) })),
        zValidator('json', z.object({ isPublished: z.boolean() })),
        async (c) => {
            const { courseId } = c.req.valid('param');
            const body = c.req.valid('json');

            try {
                const course = await db.course.findUnique({
                    where: { id: courseId },
                });

                if (!course) {
                    return c.json({ error: "Course not found" }, 404);
                }

                await db.course.update({
                    where: { id: courseId },
                    data: { isPublished: body.isPublished },
                });

                return c.json({ success: "Course published" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .delete(
        "/:courseId",
        isAdmin,
        zValidator('param', z.object({ courseId: z.string().min(1, { message: "required" }) })),
        async (c) => {
            const { courseId } = c.req.valid('param');

            try {
                const course = await db.course.findUnique({
                    where: { id: courseId },
                });

                if (!course) {
                    return c.json({ error: "Course not found" }, 404);
                }

                await db.course.delete({ where: { id: courseId } });

                return c.json({ success: "Course deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .get(
        "/",
        zValidator("query", z.object({
            page: z.string().optional(),
            limit: z.string().optional(),
            sort: z.string().optional(),
            query: z.string().optional(),
            categoryQuery: z.string().optional(),
            status: z.string().optional(),
        })),
        async (c) => {
            const { page, limit, sort, query, categoryQuery, status } = c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const isPublished = status === "true";

            const [courses, totalCount] = await Promise.all([
                db.course.findMany({
                    where: {
                        ...(query && { title: { contains: query, mode: "insensitive" } }),
                        ...(categoryQuery && {
                            category: {
                                name: { contains: categoryQuery, mode: "insensitive" },
                            },
                        }),
                        ...(status && { isPublished }),
                    },
                    include: {
                        category: true,
                        chapters: {
                            select: {
                                id: true,
                            },
                        },
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.course.count({
                    where: {
                        ...(query && { title: { contains: query, mode: "insensitive" } }),
                        ...(categoryQuery && {
                            category: {
                                name: { contains: categoryQuery, mode: "insensitive" },
                            },
                        }),
                        ...(status && { isPublished }),
                    },
                }),
            ]);

            return c.json({ courses, totalCount });
        }
    )