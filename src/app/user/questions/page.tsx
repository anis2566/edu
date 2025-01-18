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
import { QuestionList } from "@/features/user/questions/components/question-list";

export const metadata: Metadata = {
    title: "EduConnect | Questions",
    description: "Next generatation learning platform.",
};

const Questions = () => {
    return (
        <ContentLayout title="Questions">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/user">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Questions</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <QuestionList />
            </Suspense>
        </ContentLayout>
    );
};

export default Questions;