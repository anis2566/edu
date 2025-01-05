import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const webhookRouter = new Hono()
    .post(
        "/vdoCipher",
        zValidator("form", z.object({
            hookId: z.string(),
            event: z.string(),
            time: z.number(),
            payload: z.object({
                id: z.string(),
                title: z.string(),
                upload_time: z.number(),
                tags: z.nullable(z.array(z.string())),
                length: z.number(),
                status: z.string(),
            }),
        })),
        async (c) => {
            const data = c.req.valid("form");
            console.log(data)
            return c.json({ success: true, message: "Webhook processed successfully" }, 200);
        }
    )
