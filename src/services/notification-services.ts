import { PushSubscriber } from "@prisma/client";
import webPush, { WebPushError } from "web-push";
import { Knock } from "@knocklabs/node";

import { db } from "@/lib/db";

interface WebPushNotification {
    title: string;
    body: string;
    subscribers: PushSubscriber[];
}

interface KnockNotification {
    trigger: string;
    actor: {
        id: string;
        name: string;
    },
    recipients: string[];
    data: {
        redirectUrl?: string;
        chapter?: string;
    }
}

interface SendNotificationProps {
    webPushNotification: WebPushNotification;
    knockNotification: KnockNotification;
}

const knock = new Knock(process.env.KNOCK_SECRET!);

export const sendNotification = async ({ webPushNotification, knockNotification }: SendNotificationProps) => {
    if (webPushNotification.subscribers.length > 0) {
        const pushPromises = webPushNotification.subscribers.map((item) => {
            return webPush
                .sendNotification(
                    {
                        endpoint: item.endpoint,
                        keys: {
                            auth: item.auth,
                            p256dh: item.p256dh,
                        },
                    },
                    JSON.stringify({
                        title: webPushNotification.title,
                        body: webPushNotification.body,
                    }),
                    {
                        vapidDetails: {
                            subject: "mailto:anichuranis1000@@gmail.com",
                            publicKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
                            privateKey: process.env.WEB_PUSH_PRIVATE_KEY!,
                        },
                    },
                )
                .catch((error) => {
                    console.error("Error sending push notification:", error);
                    if (error instanceof WebPushError && error.statusCode === 410) {
                        console.log("Push subscription expired, deleting...");
                        return db.pushSubscriber.delete({
                            where: { id: item.id },
                        });
                    }
                });
        });

        await Promise.all(pushPromises);
    }

    await knock.workflows.trigger(knockNotification.trigger, {
        recipients: knockNotification.recipients,
        actor: knockNotification.actor,
        data: knockNotification.data,
    });

    return {
        success: "Notification sent",
    };
}