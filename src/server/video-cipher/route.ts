import { zValidator } from "@hono/zod-validator";
import axios from "axios";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";

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

export const videoCipherRouter = new Hono()
    .post(
        "/:chapterId",
        isAdmin,
        zValidator('param', z.object({
            chapterId: z.string().min(1, { message: "required" }),
        })),
        zValidator('form', z.object({
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

                if (chapter.videoUrl) {
                    const videoIds = chapter.videoUrl.split(',');
                    const deleteRes = await axios.delete(
                        `https://dev.vdocipher.com/api/videos`,
                        {
                            params: { videos: videoIds.join(',') },
                            headers: {
                                Authorization: `Apisecret ${process.env.VIDEO_CIPHER_SECRET}`,
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                        }
                    );

                    if (deleteRes.status !== 200) {
                        return c.json({ error: "Failed to delete existing videos" }, 400);
                    }
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
        "/otp/:videoId",
        sessionMiddleware,
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
            } catch {
                throw new Error("Failed to generate OTP");
            }
        }
    )