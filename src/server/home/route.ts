import { Hono } from "hono";

import { z } from "zod";
import { db } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";

export const homeRouter = new Hono()
    .get(
        "/categories",
        async (c) => {
            const categories = await db.category.findMany({
                orderBy: {
                    createdAt: "asc",
                },
            });
            return c.json(categories);
        }
    )
    .get(
        "/courses",
        zValidator("query", z.object({
            categoryId: z.string().optional(),
        })),
        async (c) => {
            const { categoryId } = c.req.valid("query");

            const courses = await db.course.findMany({
                where: {
                    isPublished: true,
                    ...(categoryId && { categoryId: categoryId })
                },
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                    chapters: {
                        select: {
                            id: true,
                        },
                    },
                },
                take: 4,
                orderBy: {
                    createdAt: "desc",
                },
            });

            const formattedCourses = courses.map((course) => ({
                ...course,
                isPurchased: false,
                progress: 0,
            }));

            return c.json(formattedCourses);
        }
    )
