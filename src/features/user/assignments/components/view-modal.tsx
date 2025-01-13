"use client"

import { SubmissionStatus } from "@prisma/client";
import { Book, BookOpen, MessageSquareReply, RefreshCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { useSubmissionView } from "@/hooks/use-submission";

export const SubmissionViewModal = () => {
    const { isOpen, submission, onClose } = useSubmissionView();

    return <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Submission</DialogTitle>
                <DialogDescription>
                    View your submission
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                        <Book className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{submission?.courseTitle}</p>
                </div>
                <div className="flex items-center gap-x-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                        <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{submission?.chapterTitle}</p>
                </div>
                <div className="flex items-center gap-x-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                        <RefreshCcw className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant={submission?.status === SubmissionStatus.Pending ? "outline" : submission?.status === SubmissionStatus.Approved ? "default" : "destructive"} className="rounded-full">
                        {submission?.status}
                    </Badge>
                </div>
                {
                    submission?.feedback && (
                        <div className="flex gap-x-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted flex-shrink-0">
                                <MessageSquareReply className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-justify">
                                {submission?.feedback}
                            </p>
                        </div>
                    )}
            </div>
        </DialogContent>
    </Dialog>
}