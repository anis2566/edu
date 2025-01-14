import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/user/components/content-layout";
import { Courses } from "@/features/user/my-courses/components/my-courses";

export const metadata: Metadata = {
    title: "EduConnect | My Courses",
    description: "Next generatation learning platform.",
};

const MyCourses = () => {
    return (
        <ContentLayout title="My Courses">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/user">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>My Courses</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <Courses />
            </Suspense>
        </ContentLayout>
    );
};

export default MyCourses;