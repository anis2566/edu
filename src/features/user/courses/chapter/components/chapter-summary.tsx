import { Clock3, FileQuestion, Paperclip } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChapterSummaryProps {
    videoLength: number;
    attachments: number;
    questions: number;
}

export const ChapterSummary = ({ videoLength, attachments, questions }: ChapterSummaryProps) => {
    return (
        <Card className="h-full max-h-fit overflow-y-auto">
            <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>
                    Summary of the chapter
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <Clock3 />
                    <Badge variant="outline">{videoLength} minutes</Badge>
                </div>
                <div className="flex items-center gap-x-3">
                    <Paperclip />
                    <Badge variant="outline">
                        {attachments} attachments
                    </Badge>
                </div>
                <div className="flex items-center gap-x-3">
                    <FileQuestion />
                    <Badge variant="outline">
                        {questions} questions
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}