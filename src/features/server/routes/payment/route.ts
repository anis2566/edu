import { Hono } from "hono";
import axios from "axios";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { db } from "@/lib/db";
import { sendNotification } from "@/services/notification-services";
import { getAdmin } from "@/features/auth/server/action";

export const paymentRouter = new Hono()

    .post(
        "/",
        sessionMiddleware,
        zValidator("json", z.object({
            courseId: z.string(),
            amount: z.number(),
        })),
        async (c) => {
            const { userId } = c.get("user");
            const { courseId, amount } = c.req.valid("json");

            try {
                const transactionId = Math.floor(100000 + Math.random() * 900000).toString();

                const res = await axios.post("https://sandbox.aamarpay.com/jsonpost.php", {
                    store_id: "aamarpaytest",
                    signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
                    cus_name: "Imtiaz Akil",
                    cus_email: "imtiaz.akil@softbd.com",
                    cus_phone: "01870762472",
                    cus_add1: "53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh",
                    cus_add2: "Dhaka",
                    cus_city: "Dhaka",
                    cus_country: "Bangladesh",
                    amount: amount,
                    tran_id: transactionId,
                    currency: "BDT",
                    success_url: `http://localhost:3000/api/payment/success?courseId=${courseId}&userId=${userId}`,
                    fail_url: `http://localhost:3000/api/payment/failed?courseId=${courseId}`,
                    cancel_url: `http://localhost:3000/api/payment/failed?courseId=${courseId}`,
                    desc: "Lend Money",
                    type: "json",
                });

                const data = res.data;

                if (!data?.payment_url) {
                    return c.json({
                        error: "Payment failed",
                    }, 400);
                }

                return c.json({
                    success: "Payment successful",
                    paymentUrl: data.payment_url,
                });
            } catch (error) {
                console.error(error);
                return c.json({
                    error: "Payment failed",
                }, 500);
            }
        }
    )
    .post(
        "/success",
        zValidator(
            "query",
            z.object({
                courseId: z.string(),
                userId: z.string(),
            }),
        ),
        zValidator(
            "form",
            z.object({
                pay_status: z.string(),
            }),
        ),
        async (c) => {
            const { pay_status } = c.req.valid("form");
            const { courseId, userId } = c.req.valid("query");

            if (!pay_status || !userId || !courseId) {
                return c.json(
                    {
                        success: false,
                        error: "Invalid request",
                    },
                    400
                );
            }

            if (pay_status === "Successful") {
                await db.purchase.create({
                    data: {
                        userId,
                        courseId,
                    },
                });

                const admin = await getAdmin();

                const user = await db.user.findUnique({
                    where: {
                        id: userId,
                    },
                });

                if (!user) {
                    throw new Error("User not found");
                }

                await sendNotification({
                    webPushNotification: {
                        title: "New Purchase",
                        body: `${user.name} has purchased a course`,
                        subscribers: admin.subscription,
                    },
                    knockNotification: {
                        trigger: "purchase",
                        actor: {
                            id: user.id,
                            name: user.name ?? "Guest",
                        },
                        recipients: [admin.adminId],
                        data: {
                        },
                    },
                });

                return c.redirect(`/payment/success?callback=/user/courses/${courseId}`);
            }

            return c.redirect("/user/courses");
        }
    )
    .post(
        "/failed",
        zValidator(
            "query",
            z.object({
                courseId: z.string(),
            }),
        ),
        async (c) => {
            const { courseId } = c.req.valid("query");
            return c.redirect(`/payment/failed?callback=/user/courses/${courseId}`);
        }
    )


