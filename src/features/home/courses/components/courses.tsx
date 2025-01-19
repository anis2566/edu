"use client";

import { useState } from "react";

import { Separator } from "@/components/ui/separator";

import { Categories } from "./categories";
import { useGetCourses } from "../api/use-get-courses";
import { CourseCard, CourseCardSkeleton } from "@/components/course-card";

export const Courses = () => {
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

    const { data: courses, isLoading } = useGetCourses(categoryId);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-center text-primary tracking-wider">Courses</h1>

            <Separator />

            <Categories categoryId={categoryId} setCategoryId={setCategoryId} />

            {isLoading && <CourseCardSkeleton />}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {!isLoading && courses?.map((course) => (
                    <CourseCard key={course.id} course={course} progress={0} showBuyButton={false} urlPrefix="/courses" />
                ))}
            </div>
        </div>
    )
};

