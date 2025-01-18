"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { navs } from "@/constant";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/logo";
import { JWTPayload } from "@/lib/session-middleware";
// import { Drawer } from "./drawer";

interface Props {
    user: JWTPayload | null;
}

export const Header = ({ user }: Props) => {
    const pathname = usePathname();

    return (
        <header className="sticky top-5 z-40 mx-auto flex w-full max-w-screen-xl items-center justify-between rounded-2xl border bg-card p-2 shadow-md">
            <Logo callbackUrl="/" />

            <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                    {navs.map((nav) => (
                        <NavigationMenuItem key={nav.href}>
                            <NavigationMenuLink asChild>
                                <Link
                                    href={nav.href}
                                    className={cn(
                                        buttonVariants({ variant: "ghost" }),
                                        "justify-start text-base",
                                        pathname === nav.href && "bg-accent",
                                    )}
                                >
                                    {nav.title}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {/* <Drawer>
                <Button className="md:hidden">
                    <Menu />
                </Button>
            </Drawer> */}


            {
                user ? (
                    <div className="hidden items-center gap-x-3 md:flex">
                        <ModeToggle />
                        <Button asChild className="rounded-full">
                            <Link href="/user">Dashboard</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="hidden items-center gap-x-3 md:flex">
                        <ModeToggle />
                        <Button asChild variant="secondary">
                            <Link href="/auth/sign-in">Sign In</Link>
                        </Button>
                        <Button asChild className="rounded-full">
                            <Link href="/auth/sign-up">Get Started</Link>
                        </Button>
                    </div>
                )
            }
        </header>
    );
};