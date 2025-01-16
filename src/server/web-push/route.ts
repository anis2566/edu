import { Hono } from "hono";

import { db } from "@/lib/db";
import { sessionMiddleware } from "@/lib/session-middleware";

export const webPushRouter = new Hono()
    .post(
        "/register",
        sessionMiddleware,
        async (c) => {
            const { userId } = c.get("user");
            const body = await c.req.json();

            if (!body.endpoint || !body.keys.p256dh || !body.keys.auth) {
                return c.json({ success: false, message: "Invalid push subscription" }, 400);
            }

            const { endpoint, keys } = body;

            const existingSubscriber = await db.pushSubscriber.findFirst({
                where: { userId, endpoint, auth: keys.auth, p256dh: keys.p256dh },
            });

            if (existingSubscriber) {
                return c.json({ success: false, message: "Push subscription already exists" }, 400);
            }

            await db.pushSubscriber.create({
                data: { endpoint, auth: keys.auth, p256dh: keys.p256dh, userId },
            });

            return c.json({ success: true, message: "Push subscription registered" }, 200);
        }
    )