"use client"

import { Banner } from "@/components/banner";
import { CoursePlayer } from "@/components/course-player";
import { useGetChapter } from "@/features/dashboard/course/chapter/api/use-get-chapter";

interface Props {
    chapterId: string
    courseId: string;
}

export const ChapterPage = ({ chapterId, courseId }: Props) => {
    const { data, isLoading, error } = useGetChapter(chapterId);

    const isLocked = data?.isLocked;
    const isCompleted = data?.isPurchased && data?.userProgress?.isCompleted;
    const isPurchased = data?.isPurchased;

    return (
        <div className="space-y-4">
            {!isLoading && isCompleted && (
                <div>
                    <Banner
                        variant="success"
                        label="You already completed this chapter."
                    />
                </div>
            )}
            {!isLoading && isLocked && (
                <div>
                    <Banner
                        variant="warning"
                        label="You need to purchase this course to watch this chapter."
                    />
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 rounded-lg overflow-hidden">
                    <CoursePlayer
                        videoId={data?.chapter?.videoUrl || ""}
                        isLocked={isLocked || false}
                        isPurchased={isPurchased || false}
                        isLoading={isLoading}
                        courseId={courseId}
                        nextChapterId={data?.nextChapter || ""}
                        previousChapterId={data?.previousChapter || ""}
                        price={data?.course?.price ?? 0}
                    />
                </div>
            </div>
        </div>
    )
}