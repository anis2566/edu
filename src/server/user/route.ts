import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { compare, hash } from "bcryptjs";

import { UserSchema } from "@/features/user/profile/schema";
import { db } from "@/lib/db";
import { sessionMiddleware } from "@/lib/session-middleware";

export const userRouter = new Hono()
    .put(
        "/",
        sessionMiddleware,
        zValidator("json", UserSchema),
        async (c) => {
            const { name, gender, dob, phone, email, image } = await c.req.valid("json");
            const { userId } = c.get("user");

            try {
                const user = await db.user.findUnique({ where: { id: userId } });
                if (!user) {
                    return c.json({ error: "User not found" }, 404);
                }

                const updatedUser = await db.user.update({
                    where: { id: userId },
                    data: { name, gender, dob, phone, email, image }
                });

                console.log(updatedUser)

                return c.json({ success: "Profile updated" });
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to update user profile" }, 500);
            }
        }
    )
    .put( 
        "/password",
        sessionMiddleware,
        zValidator("json", z.object({
            oldPassword: z.string(),
            password: z.string(),
        })),
        async (c) => {
            const { oldPassword, password } = await c.req.valid("json");
            const { userId } = c.get("user");

            try {
                const user = await db.user.findUnique({ where: { id: userId } });
                if (!user) {
                    return c.json({ error: "User not found" }, 404);
                }

                const isMatch = await compare(oldPassword, user.password ?? "");
                if (!isMatch) {
                    return c.json({ error: "Old password is incorrect" }, 400);
                }

                const hashedPassword = await hash(password, 10);

                await db.user.update({
                    where: { id: userId },
                    data: { password: hashedPassword }
                });

                return c.json({ success: "Password updated" });
            } catch (error) {
                console.error(error);
                return c.json({ error: "Failed to update password" }, 500);
            }
        }

    )
