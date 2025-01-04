import { Hono } from "hono";
import axios from "axios";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";

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
                    fail_url: `http://localhost:3000/api/payment/cancel`,
                    cancel_url: `http://localhost:3000/api/payment/cancel`,
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

                return c.redirect(`/user/courses/${courseId}`);
            }

            return c.redirect("/user/courses");
        }
    );


