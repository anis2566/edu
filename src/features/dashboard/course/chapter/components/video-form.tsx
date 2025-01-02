"use client";

import { Pencil } from "lucide-react";
import { Chapter } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useOpenUpload } from "@/hooks/use-chapter";
import { VideoPlayer } from "@/components/video-player";

interface ChapterVideoFormProps {
    initialData: Chapter;
    chapterId: string;
    courseId: string;
}

export const VideoForm = ({
    initialData,
    chapterId,
    courseId,
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const { onOpen } = useOpenUpload();

    return (
        <div className="mb-10 mt-6 rounded-md border bg-card p-4">
            <div className="flex items-center justify-between font-medium">
                <span className="font-semibold">Video</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && initialData.videoUrl ? (
                <div className="mt-4">
                    <VideoPlayer videoId={initialData.videoUrl} />
                </div>
            ) : null}
            {isEditing && (
                <Button type="button" variant="outline" className="w-full" onClick={() => onOpen(chapterId, courseId, setIsEditing)}>
                    Upload
                </Button>
            )}
        </div>
    );
};