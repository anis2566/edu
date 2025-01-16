"use client";

import { registerServiceWorker } from "@/lib/serviceWorker";
import {
    getCurrentPushSubscription,
    registerPushNotifications,
} from "@/server/web-push";

import { useEffect } from "react";

export const WebPushProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    useEffect(() => {
        async function setUpServiceWorker() {
            try {
                await registerServiceWorker();
            } catch (error) {
                console.error(error);
            }
        }
        setUpServiceWorker();
    }, []);

    useEffect(() => {
        async function registerPush() {
            const currentSubscription = await getCurrentPushSubscription();
            if (!currentSubscription) {
                try {
                    await registerPushNotifications();
                } catch (error) {
                    console.error(error);
                    if (Notification.permission === "denied") {
                        alert("Please enable push notifications in your browser settings");
                    } else {
                        alert("Something went wrong. Please try again.");
                    }
                }
            }
        }
        registerPush();
    }, []);

    return <div>{children}</div>;
};