import { Hono } from "hono";

export const webhookRouter = new Hono()
    .post(
        "/vdoCipher",
        async (c) => {
            const data = await c.req.json();
            console.log(data)
            return c.json({ success: true, message: "Webhook processed successfully" }, 200);
        }
    )
