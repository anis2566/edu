"use client"

import { SubmissionStatus } from "@prisma/client";
import { Book, BookOpen, Download, Eye, FileText, MessageSquareReply, RefreshCcw } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useSubmissionViewAdmin } from "@/hooks/use-submission";

export const SubmissionViewModalAdmin = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { isOpen, submission, onClose } = useSubmissionViewAdmin();

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
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Button asChild size="icon" variant="outline">
                            <Link
                                href={submission?.assignmentUrl || ""}
                                target="_blank"
                            >
                                <Eye className="w-5 h-5" />
                            </Link>
                        </Button>
                        <Button disabled={isLoading} size="icon" variant="outline" onClick={() => handleDownload(submission?.assignmentUrl || "", submission?.chapterTitle || "")}>
                            <Download className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-x-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                        <MessageSquareReply className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Button asChild size="icon" variant="outline">
                            <Link
                                href={submission?.fileUrl || ""}
                                target="_blank"
                            >
                                <Eye className="w-5 h-5" />
                            </Link>
                        </Button>
                        <Button disabled={isLoading} size="icon" variant="outline" onClick={() => handleDownload(submission?.fileUrl || "", submission?.chapterTitle || "")}>
                            <Download className="w-5 h-5" />
                        </Button>
                    </div>
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