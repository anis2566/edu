"use client"

import { Eye, MoreVerticalIcon, RefreshCcw } from "lucide-react"
import { SubmissionStatus } from "@prisma/client";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useGetAssignments } from "@/features/user/assignments/api/use-get-assignments";
import { useSubmission, useSubmissionView } from "@/hooks/use-submission";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { Header } from "./header";

export const AssignmentList = () => {

    const { onOpen } = useSubmissionView();
    const { onOpen: onOpenSubmission } = useSubmission();

    const { data, isLoading } = useGetAssignments();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assignments</CardTitle>
                <CardDescription>
                    Assignments you have submitted
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {
                    isLoading ? <AssignmentListSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Chapter</TableHead>
                                    <TableHead>Submitted At</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="max-w-[200px] truncate">{submission.assignment.chapter.course.title}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{submission.assignment.chapter.title}</TableCell>
                                        <TableCell>{format(submission.createdAt, "dd MMM yyyy")}</TableCell>
                                        <TableCell>
                                            <Badge variant={submission.status === SubmissionStatus.Pending ? "outline" : submission.status === SubmissionStatus.Approved ? "default" : "destructive"} className="rounded-full">
                                                {submission.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen({
                                                        ...submission,
                                                        courseTitle: submission.assignment.chapter.course.title,
                                                        chapterTitle: submission.assignment.chapter.title,
                                                    })}>
                                                        <Eye className="w-5 h-5" />
                                                        <p>View</p>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpenSubmission(submission.assignment.id)} disabled={submission.status === SubmissionStatus.Approved}>
                                                        <RefreshCcw className="w-5 h-5" />
                                                        <p>Resubmit</p>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                {!isLoading && data?.submissions.length === 0 && <EmptyStat title="No assignments found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


export const AssignmentListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Course</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Status</TableHead>
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