import { getReadyServiceWorker } from "@/lib/serviceWorker";

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
    const sw = await getReadyServiceWorker();
    return sw.pushManager.getSubscription();
}

export async function registerPushNotifications() {
    if (!("PushManager" in window)) {
        throw Error("Push notifications are not supported by this browser");
    }

    const existingSubscription = await getCurrentPushSubscription();

    if (existingSubscription) {
        throw Error("Existing push subscription found");
    }

    const sw = await getReadyServiceWorker();

    const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
    });

    await sendPushSubscriptionToServer(subscription);
}

export async function sendPushSubscriptionToServer(
    subscription: PushSubscription,
) {
    console.log("sending push to server", subscription);
    const response = await fetch("/api/webPush/register", {
        method: "POST",
        body: JSON.stringify(subscription),
    });

    if (!response.ok) {
        throw Error("Failed to send push subscription to server");
    }
}

export const SEND_NOTIFICATION = async () => { };