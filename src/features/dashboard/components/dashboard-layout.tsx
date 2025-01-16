import { SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "./sidebar"
import { WebPushProvider } from "@/components/web-push-provider"
import { getCurrent } from "@/features/auth/server/action";
import { AppKnockProviders } from "@/components/knock-provider";

export const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getCurrent();

    if (!user) {
        return null;
    }

    return (
        <WebPushProvider>
            <AppKnockProviders userId={user.userId}>
                <SidebarProvider>
                    <AppSidebar />
                    <main className="w-full">
                        {children}
                    </main>
                </SidebarProvider>
            </AppKnockProviders>
        </WebPushProvider>
    )
}