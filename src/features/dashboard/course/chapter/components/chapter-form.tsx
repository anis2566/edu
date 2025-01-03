import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  LayoutDashboard,
  LucideIcon,
  Paperclip,
  Video,
} from "lucide-react";
import { Chapter, Attachment } from "@prisma/client";

import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./title-form";
import { DescriptionForm } from "./description-form";
import { AccessForm } from "./access-form";
import { ThumbnailForm } from "./thumbnail-form";
import { AttachmentsForm } from "./attachment-form";
import { VideoForm } from "./video-form";
import { Banner } from "@/components/banner";
import { Actions } from "./action";

interface Props {
  chapter: Chapter;
  attachments: Attachment[];
  courseId: string;
}

export const ChapterForm = async ({ chapter, attachments, courseId }: Props) => {
  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
    chapter.videoThumbnail,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const isComplete = completedFields === totalFields;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}

      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/dashboard/course/${courseId}`}
            className="my-6 flex items-center text-sm transition hover:opacity-75"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to course setup
          </Link>

          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
            <Actions
              disabled={!isComplete}
              isPublished={chapter.isPublished}
              chapterId={chapter.id}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Section title="Chapter Identify" icon={LayoutDashboard}>
            <TitleForm
              initialData={chapter}
              chapterId={chapter.id}
            />
            <DescriptionForm
              initialData={chapter}
              chapterId={chapter.id}
            />
          </Section>

          <Section title="Access Settings" icon={Eye}>
            <AccessForm
              initialData={chapter}
              chapterId={chapter.id}
            />
          </Section>

          <Section title="Attachments" icon={Paperclip}>
            <AttachmentsForm
              attachments={attachments}
              chapterId={chapter.id}
            />
          </Section>

          {/* <Section title="Assignments" icon={FileText}>
            <AssignmentForm
              chapterId={chapter.id}
              assignment={assignment}
            />
          </Section> */}
        </div>

        <div>
          <Section title="Media" icon={Video}>
            <ThumbnailForm
              initialData={chapter}
              chapterId={chapter.id}
            />
            <VideoForm
              initialData={chapter}
              chapterId={chapter.id}
              courseId={chapter.courseId}
            />
          </Section>
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const Section = ({ title, icon: Icon, children }: SectionProps) => (
  <div>
    <div className="flex items-center gap-x-2">
      <IconBadge icon={Icon as LucideIcon} />
      <h2 className="text-xl">{title}</h2>
    </div>
    {children}
  </div>
);