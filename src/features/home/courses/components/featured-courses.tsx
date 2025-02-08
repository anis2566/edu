"use client"

import { Separator } from "@/components/ui/separator"

import { useGetFeaturedCourses } from "../api/use-get-featured-courses";
import { CourseCard, CourseCardSkeleton } from "@/components/course-card";

export const FeaturedCourses = () => {
    const { data, isLoading } = useGetFeaturedCourses();

    return (
        <div className="py-20 space-y-4">
            <h1 className="text-3xl font-bold text-center text-primary tracking-wider">Featured</h1>

            <Separator />

            {isLoading && <CourseCardSkeleton />}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {!isLoading && data?.courses.map((course) => (
                    <CourseCard key={course.id} course={course} progress={0} showBuyButton={false} urlPrefix="/courses" />
                ))}
            </div>
        </div>
    )
}