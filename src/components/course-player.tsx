"use client";

import { Loader2, Lock } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { VideoPlayer } from "@/components/video-player";
import { VideoController } from "@/features/user/courses/chapter/components/video-controller";

interface CoursePlayerProps {
    videoId: string;
    isLocked: boolean;
    isPurchased: boolean;
    isLoading: boolean;
    courseId: string;
    chapterId: string;
    nextChapterId: string;
    previousChapterId: string;
    price: number;
    isCompleted: boolean;
    title: string;
}

export const CoursePlayer = ({
    videoId,
    isLocked,
    isPurchased,
    isLoading,
    courseId,
    chapterId,
    nextChapterId,
    previousChapterId,
    price,
    isCompleted,
    title
}: CoursePlayerProps) => {
    if (isLoading) {
        return <Skeleton className="aspect-video w-full" />;
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-video">
                {!isLoading && !isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                    </div>
                )}
                {!isLoading && isLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary dark:text-white">
                        <Lock className="h-8 w-8" />
                        <p className="text-sm">This chapter is locked</p>
                    </div>
                )}
                {!isLocked && <VideoPlayer videoId={videoId} />}
            </div>
            <h3 className="text-2xl font-bold w-full max-w-sm truncate">{title}</h3>
            <VideoController
                courseId={courseId}
                nextChapterId={nextChapterId}
                previousChapterId={previousChapterId}
                isPurchased={isPurchased}
                price={price}
                isCompleted={isCompleted}
                chapterId={chapterId}
            />
        </div>
    );
};