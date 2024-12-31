import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./sidebar"

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                {children}
            </main>
        </SidebarProvider>
    )
}