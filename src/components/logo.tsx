"use client"

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
    callbackUrl: string;
    className?: string;
}

export const Logo = ({ callbackUrl, className }: LogoProps) => {

    return (
        <Link href={callbackUrl || "/"} className={cn("flex items-center gap-2", className)}>
            <Image src="/logo.svg" alt="Logo" width={40} height={40} className="rounded-full" />
            <span className={cn("text-lg font-bold text-primary")}>
                EduConnect
            </span>
        </Link>
    );
};