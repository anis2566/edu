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

import { db } from "@/lib/db";
import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { ChapterForm } from "@/features/dashboard/course/chapter/components/chapter-form";

export const metadata: Metadata = {
  title: "EduConnect | Course | Chapter",
  description: "Next generatation learning platform.",
};

interface Props {
  params: Promise<{ id: string, chapterId: string }>
}

const Chapter = async ({ params }: Props) => {
  const { chapterId } = (await params)

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
    },
    include: {
      attachments: true,
    },
  });

  if (!chapter) redirect("/dashboard");

  return (
    <ContentLayout title="Course">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/course">Course</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chapter</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ChapterForm chapter={chapter} attachments={chapter.attachments} />
    </ContentLayout>
  );
};

export default Chapter;