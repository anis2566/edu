import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";
import { CategorySchema } from "@/features/dashboard/category/schema";

export const categoryRouter = new Hono()
    .post(
        "/",
        isAdmin,
        zValidator("json", CategorySchema),
        async (c) => {
            const body = c.req.valid("json");

            try {
                const existingCategory = await db.category.findFirst({
                    where: {
                        name: body.name,
                    },
                });

                if (existingCategory) {
                    return c.json({ error: "Category already exists" }, 400);
                }

                await db.category.create({
                    data: body,
                });

                return c.json({ success: "Category created" }, 201);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .put(
        "/:id",
        isAdmin,
        zValidator("param", z.object({ id: z.string() })),
        zValidator("json", CategorySchema),
        async (c) => {
            const id = await c.req.param("id");
            const body = await c.req.valid(
                "json"
            );

            try {
                const category = await db.category.findUnique({
                    where: { id },
                });

                if (!category) {
                    return c.json({ error: "Category not found" }, 404);
                }

                await db.category.update({
                    where: { id },
                    data: body,
                });

                return c.json({ success: "Category edited" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to edit category" }, 500);
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
                const category = await db.category.findUnique({ where: { id } });

                if (!category) {
                    return c.json({ error: "Category not found" }, 404);
                }

                await db.category.delete({ where: { id } });

                return c.json({ success: "Category deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to delete category" }, 500);
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
        })),
        async (c) => {
            const { page, limit, sort, query } = c.req.valid("query");

            const pageNumber = parseInt(page || "1");
            const limitNumber = parseInt(limit || "5");

            const [categories, totalCount] = await Promise.all([
                db.category.findMany({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                    },
                    orderBy: {
                        ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
                    },
                    skip: (pageNumber - 1) * limitNumber,
                    take: limitNumber,
                }),
                db.category.count({
                    where: {
                        ...(query && { name: { contains: query, mode: "insensitive" } }),
                    },
                }),
            ]);

            return c.json({ categories, totalCount });
        }
    )
    .get(
        "/all",
        async (c) => {
            const categories = await db.category.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });
            return c.json({ categories });
        }
    )
    .get(
        "/forSelect",
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
