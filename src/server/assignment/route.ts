import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { AssignmentSchema } from "@/features/dashboard/course/chapter/schema";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/session-middleware";

export const assignmentRouter = new Hono()
    .post(
        "/:chapterId",
        isAdmin,
        zValidator("param", z.object({
            chapterId: z.string()
        })),
        zValidator("json", AssignmentSchema),
        async (c) => {
            const { chapterId } = c.req.valid("param");
            const body = c.req.valid("json");

            try {
                await db.assignment.upsert({
                    where: {
                        chapterId,
                    },
                    update: body,
                    create: {
                        ...body,
                        chapterId,
                    }
                })

                return c.json({ success: "Assignment created successfully" }, 200)
            } catch (error) {
                console.error(error)
                return c.json({ error: "Failed to create assignment" }, 500)
            }
        }
    )
    .delete(
        "/:assignmentId",
        isAdmin,
        zValidator("param", z.object({
            assignmentId: z.string().min(1, { message: "required" }),
        })),
        async (c) => {
            const { assignmentId } = c.req.valid("param");

            try {
                const assignment = await db.assignment.findUnique({
                    where: { id: assignmentId },
                });

                if (!assignment) {
                    return c.json({ error: "Assignment not found" }, 404);
                }

                await db.assignment.delete({ where: { id: assignmentId } });

                return c.json({ success: "Assignment deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )


