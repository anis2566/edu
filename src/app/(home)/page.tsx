"use client";

import { Hero } from "@/features/home/components/hero";
import { Courses } from "@/features/home/courses/components/courses";
import { FeaturedCourses } from "@/features/home/courses/components/featured-courses";
import { Testimonials } from "@/features/home/components/testimonials";

export default function App() {
    return (
        <div>
            <Hero />
            <Courses />
            <FeaturedCourses />
            <Testimonials />
        </div>
    )
}