"use client"

import ToggleButton from "@/components/toggle-button";

import { UserNav } from "./user-nav";
import { Notification } from "@/components/notification";

interface NavbarProps {
    title: string;
}

export function Navbar({ title }: NavbarProps) {
    return (
        <header className="sticky top-0 z-10 w-full bg-muted/40 shadow backdrop-blur supports-[backdrop-filter]:bg-muted/40 dark:shadow-muted">
            <div className="mx-4 flex h-14 items-center">
                <div className="flex items-center space-x-4">
                    <ToggleButton />
                    <h1 className="font-bold">{title}</h1>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <Notification />
                    <UserNav />
                </div>
            </div>
        </header>
    );
}