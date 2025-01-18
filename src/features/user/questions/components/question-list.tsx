"use client";

import { format } from "date-fns";
import { Eye } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetQuestions } from "../api/use-get-questions";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { useUserViewQuestion } from "@/hooks/use-question";

export const QuestionList = () => {

    const { onOpen } = useUserViewQuestion();

    const { data, isLoading } = useGetQuestions();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Questions</CardTitle>
                <CardDescription>
                    Questions you have submitted
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* <Header /> */}
                {
                    isLoading ? <QuestionListSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Chapter</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell className="max-w-[200px] truncate">{question.chapter.course.title}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{question.chapter.title}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{question.question}</TableCell>
                                        <TableCell>{format(question.createdAt, "dd MMM yyyy")}</TableCell>
                                        <TableCell>
                                            <Button size="icon" variant="ghost" onClick={() => onOpen(question)}>
                                                <Eye className="w-5 h-5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                {!isLoading && data?.questions.length === 0 && <EmptyStat title="No questions found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
};


export const QuestionListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Course</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}