import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { CourseDetails } from "@/features/dashboard/course/components/course-details";
import { db } from "@/lib/db";

export const metadata: Metadata = {
    title: "EduConnect | Course | Details",
    description: "Next generation learning platform.",
};

interface Props {
    params: Promise<{ id: string }>
}

const Course = async ({ params }: Props) => {
    const { id } = (await params)

    const course = await db.course.findUnique({
        where: { id },
        include: {
            category: true,
            chapters: {
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!course) {
        return redirect("/admin");
    }

    return (
        <ContentLayout title="Course">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin/course">Course</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CourseDetails course={course} />
        </ContentLayout>
    );
};

export default Course;