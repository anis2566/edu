import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { hash, compare } from 'bcryptjs';
import { sign, verify } from "hono/jwt";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { SignInSchema, SignUpSchema } from '../schemas';
import { db } from '@/lib/db';
import { JWTPayload } from 'hono/utils/jwt/types';
import { sessionMiddleware } from '@/lib/session-middleware';

export const authRouter = new Hono()
    .post(
        "/register",
        zValidator("json", SignUpSchema),
        async (c) => {
            try {
                const { name, email, password } = c.req.valid("json");

                const existingUser = await db.user.findUnique({ where: { email } });
                if (existingUser) {
                    return c.json({ error: "User already exists" });
                }

                const hashedPassword = await hash(password, 10);

                const user = await db.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                    },
                });

                const payload = {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    userId: user.id,
                    role: user.role,
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                };

                const secret = process.env.JWT_SECRET!;
                const token = await sign(payload, secret);

                setCookie(c, "auth_session", token, {
                    path: "/",
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
                });

                return c.json({ success: "Registration successful" });
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" });
            }
        }
    )
    .post(
        "/login",
        zValidator("json", SignInSchema),
        async (c) => {
            const { email, password } = c.req.valid("json");

            try {
                const user = await db.user.findUnique({ where: { email } });

                if (!user) {
                    return c.json({ error: "User not found" });
                }

                const isMatch = await compare(password, user.password ?? "");

                if (!isMatch) {
                    return c.json({ error: "Invalid credentials" });
                }

                const payload = {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    userId: user.id,
                    role: user.role,
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                };

                const secret = process.env.JWT_SECRET!;
                const token = await sign(payload, secret);

                setCookie(c, "auth_session", token, {
                    path: "/",
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
                });

                return c.json({ success: "Login successful" });

            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" });
            }
        }
    )
    .get(
        "/current",
        async (c) => {
            const session = getCookie(c, "auth_session");

            if (!session) {
                return c.json({ user: null }, 400);
            }

            const decodedPayload = await verify(session, process.env.JWT_SECRET!);

            if (!decodedPayload) {
                return c.json({ user: null }, 401);
            }

            const { name, email, image, userId, role } = decodedPayload;

            const user = { name, email, image, userId, role } as JWTPayload;

            return c.json({ user });
        }
    )
    .post("/logout", sessionMiddleware, async (c) => {
        deleteCookie(c, "auth_session");
        return c.json({ success: "Logout successful" });
    });
