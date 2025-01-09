"use client"

import { Eye, MessageCircleReply, MoreVerticalIcon, Trash2 } from "lucide-react"
import { format } from "date-fns"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { EmptyStat } from "@/components/empty-stat"
import { CustomPagination } from "@/components/custom-pagination"
import { useGetQuestionsAdmin } from "../api/use-get-questions-admin"
import { useDeleteQuestion, useQuestionReply, useViewQuestion } from "@/hooks/use-question"
import { Header } from "../../category/components/header"

export const QuestionList = () => {
    const { onOpen } = useViewQuestion()
    const { onOpen: onOpenReply } = useQuestionReply()
    const { onOpen: onOpenDelete } = useDeleteQuestion()

    const { data, isLoading } = useGetQuestionsAdmin()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Question</CardTitle>
                <CardDescription>Manage your questions here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {
                    isLoading ? <QuestionListSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>User</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Chapter</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Answer</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-x-3">
                                                <Avatar>
                                                    <AvatarImage src={question.user.image || ""} alt={question.user.name || ""} />
                                                    <AvatarFallback>
                                                        {question.user.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p>{question.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {question.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{question.chapter.course.title}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{question.chapter.title}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{question.question}</TableCell>
                                        <TableCell>{format(question.createdAt, "dd MMM yyyy")}</TableCell>
                                        <TableCell>{question.answers.length}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(question)}>
                                                        <Eye className="w-5 h-5" />
                                                        <p>View</p>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpenReply(question, question.id)}>
                                                        <MessageCircleReply className="w-5 h-5" />
                                                        <p>Reply</p>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(question.id)}>
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
                {!isLoading && data?.questions.length === 0 && <EmptyStat title="No questions found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


export const QuestionListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>User</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Answer</TableHead>
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
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}