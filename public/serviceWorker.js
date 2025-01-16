// @ts-check

/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (
    globalThis
  );
  
  sw.addEventListener("push", (event) => {
    const message = event.data?.json();
    const { title, body, icon, image, channelId, redirectUrl } = message; // Include redirectUrl from push message
  
    console.log("Received push message", message);
  
    async function handlePushEvent() {
      const windowClients = await sw.clients.matchAll({ type: "window" });
  
      if (windowClients.length > 0) {
        const appInForeground = windowClients.some((client) => client.focused);
  
        if (appInForeground) {
          console.log("App is in foreground, don't show notification");
          return;
        }
      }
  
      await sw.registration.showNotification(title, {
        body,
        icon,
        badge: "/logo.png",
        data: { redirectUrl }, // Pass redirect URL in notification data
      });
    }
  
    event.waitUntil(handlePushEvent());
  });
  
  sw.addEventListener("notificationclick", (event) => {
    const redirectUrl = event.notification.data?.redirectUrl;
  
    event.notification.close(); // Close the notification
  
    if (redirectUrl) {
      event.waitUntil(
        sw.clients
          .matchAll({ type: "window", includeUncontrolled: true })
          .then((windowClients) => {
            // Check if any window is already open with the URL
            for (const client of windowClients) {
              if (client.url === redirectUrl && "focus" in client) {
                return client.focus();
              }
            }
            // If not, open a new window
            if (sw.clients.openWindow) {
              return sw.clients.openWindow(redirectUrl);
            }
          }),
      );
    }
  });