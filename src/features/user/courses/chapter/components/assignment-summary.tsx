"use client";

import { RefreshCcw, Send } from "lucide-react";
import { SubmissionStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useSubmission } from "@/hooks/use-submission";

interface AssignmentSummaryProps {
    status: SubmissionStatus;
    assignmentId: string;
    hasSubmitted: boolean;
    hasAssignment: boolean;
}

export const AssignmentSummary = ({ status, assignmentId, hasSubmitted, hasAssignment }: AssignmentSummaryProps) => {
    const { onOpen } = useSubmission();

    return (
        <Card className="h-full max-h-fit overflow-y-auto">
            <CardHeader>
                <CardTitle>Assignment</CardTitle>
                <CardDescription>
                    Summary of the assignment
                </CardDescription>
            </CardHeader>
            <CardContent>
                {
                    hasAssignment && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-x-3">
                                <Send />
                                <Badge variant="outline">{hasSubmitted ? "Submitted" : "Not submitted"}</Badge>
                            </div>
                            {
                                hasSubmitted && (
                                    <div className="flex items-center gap-x-3">
                                        <RefreshCcw />
                                        <Badge variant={status === SubmissionStatus.Pending ? "outline" : status === SubmissionStatus.Approved ? "default" : "destructive"} className="rounded-full">{status}</Badge>
                                    </div>
                                )
                            }
                            <Button disabled={hasSubmitted && status === SubmissionStatus.Pending || hasSubmitted && status === SubmissionStatus.Approved} variant="outline" className="ml-auto flex" onClick={() => onOpen(assignmentId)}>Submit Assignment</Button>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    )
}
