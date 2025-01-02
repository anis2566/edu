"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { useTogglePublish } from "../api/use-toggle-publish";
import { LoadingButton } from "@/components/loading-button";
import { useDeleteChapter } from "@/hooks/use-chapter";

interface ChapterActionsProps {
    disabled: boolean;
    isPublished: boolean;
    chapterId: string;
}

export const Actions = ({
    disabled,
    isPublished,
    chapterId,
}: ChapterActionsProps) => {
    const { onOpen } = useDeleteChapter();

    const { mutate: togglePublish, isPending } = useTogglePublish();

    const handleTogglePublish = () => {
        togglePublish({
            param: { chapterId },
            json: { isPublished: !isPublished },
        });
    };

    return (
        <div className="flex items-center gap-x-2">
            <LoadingButton
                isLoading={isPending}
                title={isPublished ? "Unpublish" : "Publish"}
                loadingTitle={isPublished ? "Unpublishing..." : "Publishing..."}
                onClick={handleTogglePublish}
                type="button"
                variant="outline"
                disabled={disabled || isPending}
            />
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpen(chapterId)}
                        >
                            <Trash2 className="h-5 w-5 text-rose-500" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete chapter</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};