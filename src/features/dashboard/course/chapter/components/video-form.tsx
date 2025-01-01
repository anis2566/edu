"use client";

import { Pencil } from "lucide-react";
import { Chapter } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useOpenUpload } from "@/hooks/use-chapter";

interface ChapterVideoFormProps {
    initialData: Chapter;
    chapterId: string;
}

export const VideoForm = ({
    initialData,
    chapterId,
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const { onOpen } = useOpenUpload();

    let isPending = false;
    let isLoading = false;

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
                    <p>Video</p>
                    {/* <VideoPlayer videoId={initialData.videoUrl} /> */}
                </div>
            ) : null}
            {isEditing && (
                <Button type="button" variant="outline" className="w-full" onClick={() => onOpen(chapterId)}>
                    Upload
                </Button>
            )}
        </div>
    );
};