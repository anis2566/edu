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

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { AssignmentList } from "@/features/dashboard/assignment/components/assignment-list";

export const metadata: Metadata = {
    title: "EduConnect | Assignment",
    description: "Next generatation learning platform.",
};

const Assignments = () => {
    return (
        <ContentLayout title="Assignment">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Assignments</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <AssignmentList />
            </Suspense>
        </ContentLayout>
    );
};

export default Assignments;