"use client";

import { format } from "date-fns";
import "@smastrom/react-rating/style.css";
import { Rating } from "@smastrom/react-rating";
import { Eye, MoreVerticalIcon, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Header } from "@/features/dashboard/category/components/header";
import { useGetReviews } from "../api/use-get-reviews";
import { EmptyStat } from "@/components/empty-stat";
import { CustomPagination } from "@/components/custom-pagination";
import { useViewReview, useDeleteReview } from "@/hooks/use-review";

export const ReviewList = () => {
    const { onOpen } = useViewReview();
    const { onOpen: onOpenDelete } = useDeleteReview();

    const { data, isLoading } = useGetReviews();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>Manage your reviews here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {
                    isLoading ? <ReviewListSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-accent hover:bg-accent/80">
                                    <TableHead>User</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Review</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.reviews.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-x-3">
                                                <Avatar>
                                                    <AvatarImage src={review.user.image || ""} alt={review.user.name || ""} />
                                                    <AvatarFallback>
                                                        {review.user.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p>{review.user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {review.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{review.course.title}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            <Rating value={review.rating ?? 0} readOnly style={{ maxWidth: 70 }} />
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{review.content}</TableCell>
                                        <TableCell>{format(review.createdAt, "dd MMM yyyy")}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen({
                                                        courseName: review.course.title,
                                                        userName: review.user.name || "",
                                                        rating: review.rating,
                                                        content: review.content,
                                                    })}>
                                                        <Eye className="w-5 h-5" />
                                                        <p>View</p>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(review.id)}>
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
                {!isLoading && data?.reviews.length === 0 && <EmptyStat title="No reviews found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
};


export const ReviewListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>User</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Date</TableHead>
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