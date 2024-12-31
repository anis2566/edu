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
