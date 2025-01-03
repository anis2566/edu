import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import axios from "axios";

import { db } from "@/lib/db";
import { isAdmin } from "@/lib/session-middleware";
import { ChapterSchema } from "../schema";

type ClientPayload = {
    policy: string;
    key: string;
    "x-amz-signature": string;
    "x-amz-algorithm": string;
    "x-amz-date": string;
    "x-amz-credential": string;
    uploadLink: string;
};

export type UploadPayload = {
    clientPayload: ClientPayload;
    videoId: string;
};

export type VideoOtpPayload = {
    otp: string;
    playbackInfo: string;
};

export const chapterRouter = new Hono()
    .post(
        '/',
        isAdmin,
        zValidator('json', z.object({
            title: z.string().min(1, { message: "required" }),
            courseId: z.string().min(1, { message: "required" }),
        })),
        async (c) => {
            const { title, courseId } = c.req.valid('json');

            try {
                const course = await db.course.findUnique({
                    where: { id: courseId },
                });

                if (!course) {
                    return c.json({ error: "Course not found" }, 404);
                }

                await db.chapter.create({
                    data: {
                        title,
                        courseId,
                    },
                });

                return c.json({ success: "Chapter created" }, 201);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .put(
        "/reorder",
        isAdmin,
        zValidator('json', z.object({
            list: z.array(z.object({ id: z.string(), position: z.number() })),
        })),
        async (c) => {
            const { list } = c.req.valid('json');

            try {
                const transaction = list.map((item) => {
                    return db.chapter.update({
                        where: { id: item.id },
                        data: { position: item.position },
                    });
                });

                await db.$transaction(transaction);

                return c.json({ success: "Chapters reordered" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .put(
        "/:chapterId",
        isAdmin,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        zValidator('json', ChapterSchema),
        async (c) => {
            const { chapterId } = c.req.valid('param');
            const body = c.req.valid('json');

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    return c.json({ error: "Chapter not found" }, 404);
                }

                await db.chapter.update({
                    where: { id: chapterId },
                    data: body,
                });

                return c.json({ success: "Chapter updated" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .post(
        "/attachment",
        isAdmin,
        zValidator('json', z.object({
            title: z.string().min(1, { message: "required" }),
            url: z.string().min(1, { message: "required" }),
            chapterId: z.string().min(1, { message: "required" }),
        })),
        async (c) => {
            const { chapterId, title, url } = c.req.valid('json');

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    return c.json({ error: "Chapter not found" }, 404);
                }

                await db.attachment.create({
                    data: { title, url, chapterId },
                });

                return c.json({ success: "Attachment created" }, 201);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .delete(
        "/attachment/:attachmentId",
        isAdmin,
        zValidator('param', z.object({ attachmentId: z.string().min(1, { message: "required" }) })),
        async (c) => {
            const { attachmentId } = c.req.valid('param');

            try {
                const attachment = await db.attachment.findUnique({
                    where: { id: attachmentId },
                });

                if (!attachment) {
                    return c.json({ error: "Attachment not found" }, 404);
                }

                await db.attachment.delete({ where: { id: attachmentId } });

                return c.json({ success: "Attachment deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .post(
        "/uploadVideo/:chapterId",
        isAdmin,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        zValidator("form", z.object({
            file: z.instanceof(File, { message: "required" }),
        })),
        async (c) => {
            const { chapterId } = c.req.valid('param');
            const body = c.req.valid('form');

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    return c.json({ error: "Chapter not found" }, 404);
                }

                const res = await axios.put(
                    `https://dev.vdocipher.com/api/videos?title=${chapter.title}`,
                    {},
                    {
                        headers: {
                            Authorization: `Apisecret ${process.env.VIDEO_CIPHER_SECRET}`,
                        },
                    }
                );

                if (res.status !== 200) {
                    return c.json({ error: "Failed to generate video" }, 400);
                }

                const data = res.data as UploadPayload;

                const { videoId, clientPayload } = data;

                if (!videoId || !clientPayload.key || !clientPayload.policy || !clientPayload.uploadLink || !clientPayload["x-amz-signature"] || !clientPayload["x-amz-algorithm"] || !clientPayload["x-amz-date"] || !clientPayload["x-amz-credential"]) {
                    return c.json({ error: "Failed to generate video" }, 400);
                }

                const formData = new FormData();
                formData.append("policy", data.clientPayload.policy);
                formData.append("key", data.clientPayload.key);
                formData.append("x-amz-signature", data.clientPayload["x-amz-signature"]);
                formData.append("x-amz-algorithm", data.clientPayload["x-amz-algorithm"]);
                formData.append("x-amz-date", data.clientPayload["x-amz-date"]);
                formData.append("x-amz-credential", data.clientPayload["x-amz-credential"]);
                formData.append("success_action_status", "201");
                formData.append("success_action_redirect", "");
                formData.append("file", body.file);

                const uploadRes = await fetch(data.clientPayload.uploadLink, {
                    method: 'POST',
                    body: formData,
                });

                if (uploadRes.status !== 201) {
                    const errorText = await uploadRes.text();
                    console.error(`Error uploading file: ${errorText}`);
                    throw new Error('File upload failed');
                }


                await db.chapter.update({
                    where: { id: chapterId },
                    data: { videoUrl: data.videoId },
                });

                return c.json({ success: "Video uploaded" }, 200);
            } catch (error) {
                console.log(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .get(
        "/videoOtp/:videoId",
        isAdmin,
        zValidator('param', z.object({ videoId: z.string().min(1, { message: "required" }) })),
        async (c) => {
            const { videoId } = c.req.valid('param');

            try {
                const res = await axios.post(
                    `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
                    {
                        ttl: 300,
                    },
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Apisecret ${process.env.VIDEO_CIPHER_SECRET}`,
                        },
                    },
                );

                if (res.status !== 200) {
                    throw new Error("Failed to generate OTP");
                }

                if (!res.data.otp || !res.data.playbackInfo) {
                    throw new Error("Failed to generate OTP");
                }

                const resData: VideoOtpPayload = res.data;

                return c.json(resData, 200);
            } catch (error) {
                throw new Error("Failed to generate OTP");
            }
        }
    )
    .put(
        "/togglePublish/:chapterId",
        isAdmin,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        zValidator('json', z.object({ isPublished: z.boolean() })),
        async (c) => {
            const { chapterId } = c.req.valid('param');
            const body = c.req.valid('json');

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    return c.json({ error: "Chapter not found" }, 404);
                }

                await db.chapter.update({
                    where: { id: chapterId },
                    data: { isPublished: body.isPublished },
                });

                return c.json({ success: "Chapter published" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
    .delete(
        "/:chapterId",
        isAdmin,
        zValidator('param', z.object({ chapterId: z.string().min(1, { message: "required" }) })),
        async (c) => {
            const { chapterId } = c.req.valid('param');

            try {
                const chapter = await db.chapter.findUnique({
                    where: { id: chapterId },
                });

                if (!chapter) {
                    return c.json({ error: "Chapter not found" }, 404);
                }

                await db.chapter.delete({ where: { id: chapterId } });

                return c.json({ success: "Chapter deleted" }, 200);
            } catch (error) {
                console.error(error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    )
