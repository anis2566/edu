"use client"

import { Loader2 } from "lucide-react";

import { Categories } from "./categories"
import { Search } from "./search"
import { CourseCard, CourseCardSkeleton } from "@/components/course-card";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { EmptyStat } from "@/components/empty-stat";
import { useGetCourses } from "../api/use-get-courses";

export const CourseList = () => {
    const { courses, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useGetCourses();

    return (
        <div className="space-y-6">
            <Categories />
            <Search />

            {
                status !== "pending" && courses.length === 0 && <EmptyStat title="No courses found" description="Please try to search with similar keyword" />
            }

            {
                status === "pending" ? <CourseCardSkeleton /> :
                    (
                        <InfiniteScrollContainer
                            className="grid gap-4 md:grid-cols-4"
                            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
                        >
                            {courses.map((course, i) => (
                                <CourseCard key={i} course={course} isPurchased={course.isPurchased} totalReviews={5} isReviewed={true} progress={null} />
                            ))}
                            {isFetchingNextPage && (
                                <div className="flex justify-center">
                                    <Loader2 className="mx-auto my-3 animate-spin" />
                                </div>
                            )}
                        </InfiniteScrollContainer>
                    )
            }
        </div>
    )
}