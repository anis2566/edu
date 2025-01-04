"use client"

import { SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "./sidebar"
import { usePathname } from "next/navigation";

export const UserLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isNoLayout = pathname.includes("/chapters");

    if (isNoLayout) {
        return <>{children}</>
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                {children}
            </main>
        </SidebarProvider>
    )
}