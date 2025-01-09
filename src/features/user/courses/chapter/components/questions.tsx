import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useAddQuestion, useQuestionReplyUser } from "@/hooks/use-question";
import { useGetQuestions } from "../api/use-get-questions";

interface QuestionsProps {
    chapterId: string;
}

export const Questions = ({ chapterId }: QuestionsProps) => {
    const { onOpen } = useAddQuestion();
    const { onOpen: onOpenReply } = useQuestionReplyUser();

    const { questions, fetchNextPage, hasNextPage, isFetching, status } = useGetQuestions({ chapterId });

    const [expandedQuestions, setExpandedQuestions] = useState<{ [key: string]: boolean }>({});

    const toggleExpand = (questionId: string) => {
        setExpandedQuestions((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <p className="text-xl font-bold">Question & Answer</p>
                    <Button variant="outline" onClick={() => onOpen(chapterId)}>
                        Ask Question
                    </Button>
                </CardTitle>
                <CardDescription>Ask a question about this chapter</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    {hasNextPage && (
                        <Button
                            variant="link"
                            className="mx-auto block"
                            disabled={isFetching}
                            onClick={() => fetchNextPage()}
                        >
                            Load previous
                        </Button>
                    )}
                    {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
                    {status === "success" && !questions.length && (
                        <p className="text-center text-muted-foreground">
                            No questions yet.
                        </p>
                    )}
                    {status === "error" && (
                        <p className="text-center text-destructive">
                            An error occurred while loading questions.
                        </p>
                    )}
                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex space-x-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={question.user.image || ""}
                                            alt={question.user.name || ""}
                                        />
                                        <AvatarFallback>
                                            {question.user.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <h3 className="font-semibold">{question.user.name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {formatDistanceToNow(new Date(question.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => onOpenReply(question.id)}>
                                                Reply
                                            </Button>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-2">{question.question}</p>
                                    </div>
                                </div>
                                <div className="ml-12 space-y-4">
                                    {(expandedQuestions[question.id]
                                        ? question.answers
                                        : question.answers.slice(0, 3)
                                    ).map((answer) => (
                                        <div className="flex space-x-4" key={answer.id}>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={answer.user.image || ""}
                                                    alt={answer.user.name || ""}
                                                />
                                                <AvatarFallback>
                                                    {answer.user.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <div className="flex flex-col">
                                                        <h4 className="font-semibold">{answer.user.name}</h4>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDistanceToNow(new Date(answer.createdAt), {
                                                                addSuffix: true,
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-2">{answer.answer}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {question.answers.length > 3 && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => toggleExpand(question.id)}
                                        >
                                            {expandedQuestions[question.id] ? "Show Less" : "Show More"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
