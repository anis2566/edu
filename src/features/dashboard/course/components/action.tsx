"use client";

import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {

    const togglePublisth = () => {
        // if (isPublished) {
        //   toast.loading("Chapter unpublishing...", {
        //     id: "unpublish-course",
        //   });
        //   unpublishCourse(courseId);
        // } else {
        //   toast.loading("Chapter publishing...", {
        //     id: "publish-course",
        //   });
        //   publishCourse(courseId);
        // }
    };

    return (
        <div className="flex items-center gap-x-2">
            <Button
                // disabled={disabled || isPending || isLoading}
                disabled={disabled}
                variant="outline"
                size="sm"
                onClick={togglePublisth}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                        //   onClick={() => onOpen(courseId)}
                        >
                            <Trash2 className="h-5 w-5 text-rose-500" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete course</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};