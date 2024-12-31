"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import { getAdminMenuList } from "@/lib/menu-list"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

export function AppSidebar() {
    const pathname = usePathname();

    const menuList = useMemo(() => getAdminMenuList(pathname), [pathname])

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Logo callbackUrl="/dashboard" />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {
                    menuList.map((group, index) => (
                        <SidebarGroup key={index}>
                            {
                                group.groupLabel && (
                                    <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
                                )
                            }
                            <SidebarMenu>
                                {group.menus.map((menu, index) => (
                                    menu.submenus.length > 0 ? (
                                        <Collapsible
                                            key={index}
                                            asChild
                                            defaultOpen={menu.active}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton tooltip={menu.label}>
                                                        {menu.icon && <menu.icon />}
                                                        <span>{menu.label}</span>
                                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {menu.submenus?.map((subItem) => (
                                                            <SidebarMenuSubItem key={subItem.label}>
                                                                <SidebarMenuSubButton asChild className={cn("hover:bg-muted", subItem.active && "bg-muted")}>
                                                                    <Link href={subItem.href}>
                                                                        <span>{subItem.label}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuItem key={index}>
                                            <SidebarMenuButton tooltip={menu.label} asChild className={cn("hover:bg-muted", menu.active && "bg-muted")}>
                                                <Link href={menu.href}>
                                                    {menu.icon && <menu.icon />}
                                                    <span>{menu.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    ))
                }
            </SidebarContent>
        </Sidebar>
    )
}