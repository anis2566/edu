"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock3, DollarSign } from "lucide-react";
import { Course } from "@prisma/client";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";

import { IconBadge } from "./icon-badge";
import { formatPrice, secondsToHMS } from "@/lib/utils";
import { CourseProgress } from "@/features/user/courses/chapter/components/course-progress";
import { useReview } from "@/hooks/use-review";

export type CourseWithExtended = Omit<Course, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
    category: { name: string } | null;
    chapters: { id: string }[];
    isPurchased: boolean;
    isReviewed: boolean;
};

interface Props {
    course: CourseWithExtended;
    progress: number | null;
    showBuyButton?: boolean;
    urlPrefix?: string;
}

export const CourseCard = ({ course, progress, showBuyButton = true, urlPrefix = "/user/courses" }: Props) => {
    const { onOpen } = useReview();

    return (
        <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
            <Link href={`${urlPrefix}/${course.id}`}>
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <Image
                        fill
                        className="object-cover"
                        alt={course.title}
                        src={course.imageUrl || ""}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <Badge variant="default" className="max-w-fit rounded-full">{course.category?.name}</Badge>
                    <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base space-x-1 pt-1">
                        <p>{course.title}</p>
                        <div className="flex items-center gap-x-1">
                            <Rating value={course.rating ?? 0} readOnly style={{ maxWidth: 70 }} />
                            <span className="text-xs text-gray-500">({course.totalReviews})</span>
                        </div>
                    </div>
                    <div className="my-1 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {course.chapters?.length}{" "}
                                {course.chapters?.length === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <IconBadge size="sm" icon={Clock3} />
                            <span>
                                {secondsToHMS(course.length)}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
            {
                !course.isPurchased && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-1">
                            <IconBadge size="sm" icon={DollarSign} />
                            <span>{formatPrice(course.price || 0)}</span>
                        </div>
                        <Button onClick={() => { }} disabled={false} className={`${showBuyButton ? "block" : "hidden"}`}>
                            Buy Now
                        </Button>
                    </div>
                )
            }
            {progress && progress > 0 ? (
                <CourseProgress
                    variant={progress === 100 ? "success" : "default"}
                    size="sm"
                    value={progress || 0}
                />
            ) : null
            }
            {
                course.isPurchased && !course.isReviewed && (
                    <Button variant="outline" className="w-full mt-4" onClick={() => onOpen(course.id)}>
                        Leave a Review
                    </Button>
                )
            }
        </div>
    );
};

export const CourseCardSkeleton = () => {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="group overflow-hidden rounded-lg border p-3 transition hover:shadow-sm"
                >
                    <div className="relative aspect-video w-full overflow-hidden rounded-md">
                        <Skeleton className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-y-1 pt-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-1/3 rounded-full" />
                        <Skeleton className="h-6 w-1/3 rounded-full" />
                        <Skeleton className="h-6 w-1/3 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};