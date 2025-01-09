"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Banner } from "@/components/banner";
import { CoursePlayer } from "@/components/course-player";
import { useGetChapter } from "@/features/dashboard/course/chapter/api/use-get-chapter";
import { ChapterSummary } from "./chapter-summary";
import { Attachments } from "./attachments";
import { secondsToHMS } from "@/lib/utils";
import { Questions } from "./questions";
import { AssignmentList } from "./assignment-list";

interface Props {
    chapterId: string
    courseId: string;
}

export const ChapterPage = ({ chapterId, courseId }: Props) => {
    const { data, isLoading } = useGetChapter(chapterId);

    const isLocked = data?.isLocked
    const isCompleted = data?.userProgress?.isCompleted;
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
                        isLocked={isLocked ?? true}
                        isPurchased={isPurchased ?? false}
                        isLoading={isLoading}
                        courseId={courseId}
                        chapterId={chapterId}
                        nextChapterId={data?.nextChapter ?? ""}
                        previousChapterId={data?.previousChapter ?? ""}
                        price={data?.course?.price ?? 0}
                        isCompleted={isCompleted ?? false}
                        title={data?.course?.title ?? ""}
                    />
                </div>
                <ChapterSummary description={data?.chapter?.description ?? ""} videoLength={secondsToHMS(data?.chapter?.videoLength ?? 0)} attachments={data?.chapter?.attachments?.length ?? 0} questions={3} />
            </div>

            <Tabs defaultValue="attachments" className="w-full pt-6">
                <TabsList className="w-full">
                    <TabsTrigger value="attachments">Attachments</TabsTrigger>
                    <TabsTrigger value="assignment">Assignment</TabsTrigger>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>
                <TabsContent value="attachments">
                    <Attachments attachments={data?.chapter?.attachments ?? []} />
                </TabsContent>
                <TabsContent value="assignment">
                    {/* <AssignmentList assignment={data?.chapter?.as ?? null} /> */}
                </TabsContent>
                <TabsContent value="questions">
                    <Questions chapterId={chapterId} />
                </TabsContent>
            </Tabs>

        </div>
    )
}