import React, { useState } from "react";
import { Clock3, FileQuestion, Paperclip } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChapterSummaryProps {
    videoLength: string;
    attachments: number;
    questions: number;
    description: string;
}

export const ChapterSummary = ({ videoLength, attachments, questions, description }: ChapterSummaryProps) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const characterLimit = 100;

    const toggleDescription = () => {
        setShowFullDescription((prev) => !prev);
    };

    const isDescriptionLong = description.length > characterLimit;

    const displayedDescription = showFullDescription
        ? description
        : `${description.slice(0, characterLimit)}${isDescriptionLong ? "..." : ""}`;

    return (
        <Card className="h-full max-h-fit overflow-y-auto">
            <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>
                    Summary of the chapter
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex flex-col items-start">
                    <p>{displayedDescription}</p>
                    {isDescriptionLong && (
                        <Button variant="link" size="sm" onClick={toggleDescription}>
                            {showFullDescription ? "Show Less" : "Show More"}
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-x-3">
                    <Clock3 />
                    <Badge variant="outline">{videoLength}</Badge>
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
        </Card >
    );
};
