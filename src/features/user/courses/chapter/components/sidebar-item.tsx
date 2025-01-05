"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
    label: string;
    id: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
    purchased: boolean;
}

export const CourseSidebarItem = ({
    label,
    id,
    isCompleted,
    courseId,
    isLocked,
    purchased,
}: CourseSidebarItemProps) => {
    const pathname = usePathname();

    const Icon = purchased ? isCompleted ? CheckCircle : PlayCircle : isLocked ? Lock : PlayCircle;
    const isActive = pathname?.includes(id);

    return (
        <Link
            href={`/user/courses/${courseId}/chapters/${id}`}
            className={cn(
                "flex h-12 items-center gap-x-2 overflow-hidden pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
                isActive &&
                "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700 dark:bg-muted dark:text-white",
                isCompleted && "text-emerald-700 hover:text-emerald-700",
                isCompleted && isActive && "bg-emerald-200/20",
            )}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                    size={22}
                    className={cn(
                        "text-slate-500",
                        isActive && "text-slate-700 dark:text-white",
                        isCompleted && "text-emerald-700",
                    )}
                />
                {label}
            </div>
            <div
                className={cn(
                    "ml-auto h-full border-2 border-slate-700 opacity-0 transition-all",
                    isActive && "opacity-100",
                    isCompleted && "border-emerald-700",
                )}
            />
        </Link>
    );
};