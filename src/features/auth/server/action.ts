"use server";

import { verify } from "hono/jwt";
import { cookies } from "next/headers";
import { cache } from "react";

import { JWTPayload } from "@/lib/session-middleware";

export const getCurrent = cache(async () => {
    const session = (await cookies()).get("auth_session");

    if (!session) {
        return null;
    }

    const decodedPayload = await verify(session.value, process.env.JWT_SECRET!);

    if (!decodedPayload) {
        return null;
    }

    const user: JWTPayload = {
        name: decodedPayload.name as string,
        image: decodedPayload.image as string | null,
        userId: decodedPayload.userId as string,
        role: decodedPayload.role as string,
        email: decodedPayload.email as string,
    };

    return user;
});