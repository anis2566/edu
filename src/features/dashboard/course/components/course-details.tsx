"use client";

import { Category, Chapter, Course } from "@prisma/client";
import { CircleDollarSign, Layers3, LayoutDashboard, ListChecks, LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./title-form";
import { DescriptionForm } from "./description-form";
import { ImageForm } from "./image-form";
import { CategoryForm } from "./category-form";
import { PriceForm } from "./price-form";
import { ChaptersForm } from "./chapter-form";
import { Banner } from "@/components/banner";
import { Actions } from "./action";

interface CourseWithRelations extends Course {
    category: Category | null;
    chapters: Chapter[];
}

interface Props {
    course: CourseWithRelations;
}

export const CourseDetails = ({ course }: Props) => {
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some((chapter) => chapter.isPublished),
    ];

    const completedFieldsCount = requiredFields.filter(Boolean).length;
    const totalFieldsCount = requiredFields.length;

    const completionText = `(${completedFieldsCount}/${totalFieldsCount})`;
    const isComplete = completedFieldsCount === totalFieldsCount;

    return (
        <>
            {!course.isPublished && (
                <Banner label="This course is unpublished. It will not be visible to the students." />
            )}
            <div>
                <div className="flex items-center justify-between">
                    <Header title="Course setup" subtitle={`Complete all fields ${completionText}`} />
                    <Actions disabled={!isComplete} courseId={course.id} isPublished={course.isPublished} />
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <SectionHeader icon={LayoutDashboard} title="Course Identity" />
                        <TitleForm initialData={course} courseId={course.id} />
                        <DescriptionForm initialData={course} courseId={course.id} />
                        <ImageForm initialData={course} courseId={course.id} />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <SectionHeader icon={Layers3} title="Category" />
                            <CategoryForm initialData={course} courseId={course.id} />
                        </div>

                        <div>
                            <SectionHeader icon={CircleDollarSign} title="Pricing" />
                            <PriceForm initialData={course} courseId={course.id} />
                        </div>

                        <div>
                            <SectionHeader icon={ListChecks} title="Chapters" />
                            <ChaptersForm chapters={course.chapters} courseId={course.id} />
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="flex items-center justify-between">
        <div className="flex flex-col">
            <h1 className="mt-6 text-2xl font-medium">{title}</h1>
            <span className="text-sm text-slate-700">{subtitle}</span>
        </div>
    </div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: React.ComponentType; title: string }) => (
    <div className="flex items-center gap-x-2">
        <IconBadge icon={Icon as LucideIcon} />
        <h2 className="text-xl">{title}</h2>
    </div>
);