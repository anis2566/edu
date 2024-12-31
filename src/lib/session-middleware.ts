import "server-only";

import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export type JWTPayload = {
    name: string;
    email: string;
    image: string | null;
    userId: string;
    role: string;
};

type AdditionalContext = {
    Variables: {
        user: JWTPayload;
    };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
    async (c, next) => {
        const session = getCookie(c, "auth_session");

        if (!session) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const decodedPayload = await verify(session, process.env.JWT_SECRET!);

        if (!decodedPayload) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const { name, email, image, userId, role } = decodedPayload;

        const user = { name, email, image, userId, role } as JWTPayload;

        c.set("jwtPayload", user);
        c.set("user", user);

        await next();
    }
);

export const isAdmin = createMiddleware<AdditionalContext>(
    async (c, next) => {
        const session = getCookie(c, "auth_session");

        if (!session) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const decodedPayload = await verify(session, process.env.JWT_SECRET!);

        if (!decodedPayload) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const { role } = decodedPayload;

        if (role !== "Admin") {
            return c.json({ error: "Unauthorized" }, 401);
        }

        await next();
    }
);