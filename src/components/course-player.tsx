"use client";

import { Loader2, Lock } from "lucide-react";
import { Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { VideoPlayer } from "@/components/video-player";
import { formatPrice } from "@/lib/utils";
import { VideoController } from "@/features/user/courses/chapter/components/video-controller";

interface CoursePlayerProps {
    videoId: string;
    isLocked: boolean;
    isPurchased: boolean;
    isLoading: boolean;
    courseId: string;
    nextChapterId: string;
    previousChapterId: string;
    price: number;
}

export const CoursePlayer = ({
    videoId,
    isLocked,
    isPurchased,
    isLoading,
    courseId,
    nextChapterId,
    previousChapterId,
    price
}: CoursePlayerProps) => {
    const handleEnroll = () => {
        // if (course?.price) {
        //   createPayment({ amount: course.price.toString(), courseId });
        // }
    };

    if (isLoading) {
        return <Skeleton className="aspect-video w-full" />;
    }

    let isPending = false;

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
                {!isPurchased && !isLocked && <VideoPlayer videoId={videoId} />}
                {/* {isPurchased && isPreviousChapterCompleted && (
                    <VideoPlayer videoId={videoId} />
                )} */}
            </div>
            {/* {!isPurchased && (
                <Button onClick={handleEnroll} disabled={isPending}>
                    Enroll with {formatPrice(course?.price ?? 0)}
                </Button>
            )} */}
            <VideoController
                courseId={courseId}
                nextChapterId={nextChapterId}
                previousChapterId={previousChapterId}
                isPurchased={isPurchased}
                price={price}
            />
        </div>
    );
};