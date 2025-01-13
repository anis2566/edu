"use client"

import { Eye, MoreVerticalIcon, RefreshCcw, Trash2 } from "lucide-react"
import { SubmissionStatus } from "@prisma/client";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useGetAssignments } from "@/features/dashboard/assignment/api/use-get-assignments";
import { useDeleteSubmission, useSubmissionStatus, useSubmissionViewAdmin } from "@/hooks/use-submission";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { Header } from "../../category/components/header";

export const AssignmentList = () => {

    const { onOpen: onOpenSubmissionStatus } = useSubmissionStatus();
    const { onOpen } = useSubmissionViewAdmin();
    const { onOpen: onOpenDeleteSubmission } = useDeleteSubmission();

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
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>User</TableHead>
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
                                        <TableCell>
                                            <div className="flex items-center gap-x-3">
                                                <Avatar>
                                                    <AvatarImage src={submission.user.image || ""} alt={submission.user.name || ""} />
                                                    <AvatarFallback>
                                                        {submission.user.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p>{submission.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {submission.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
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
                                                        assignmentUrl: submission.assignment.fileUrl,
                                                    })}>
                                                        <Eye className="w-5 h-5" />
                                                        <p>View</p>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpenSubmissionStatus(submission.id, submission.status)}>
                                                        <RefreshCcw className="w-5 h-5" />
                                                        <p>Change Status</p>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDeleteSubmission(submission.id)}>
                                                        <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
                                                        <p className="group-hover:text-rose-600">Delete</p>
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
                    <TableHead>User</TableHead>
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
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}