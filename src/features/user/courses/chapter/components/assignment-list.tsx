"use client"

import { Assignment } from "@prisma/client"
import { useState } from "react";

import { LoadingButton } from "@/components/loading-button";

type AssignmentWithExtended = Omit<Assignment, 'createdAt' | 'updatedAt' | "dueDate"> & {
    createdAt: string;
    updatedAt: string;
    dueDate: string | null;
};

interface Props {
    assignment: AssignmentWithExtended | null
}

export const AssignmentList = ({ assignment }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDownload = async (url: string, filename: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setIsLoading(false)
            console.error("Download failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {assignment && (
                <div
                    className="flex items-center justify-between rounded-md border p-2"
                >
                    <p className="text-muted-foreground">{assignment.title}</p>
                    <LoadingButton
                        type="button"
                        isLoading={isLoading}
                        title="Download"
                        loadingTitle="Downloading..."
                        onClick={() => handleDownload(assignment.fileUrl, assignment.title)}
                    />
                </div>
            )}
        </div>
    )
}
