import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getCurrent } from "@/features/auth/server/action";
import { CourseSidebar } from "@/features/user/courses/chapter/components/sidebar";
import { CourseNavbar } from "@/features/user/courses/chapter/components/course-navbar";

interface Props {
    params: Promise<{ id: string, chapterId: string }>;
    children: React.ReactNode;
}

const ChapterLayout = async ({ params, children }: Props) => {
    const { id } = await params;

    const user = await getCurrent();

    if (!user?.userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id,
            isPublished: true,
        },
        include: {
            purchases: {
                where: {
                    userId: user.userId,
                }
            },
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    attachments: true,
                    userProgress: {
                        where: {
                            userId: user.userId,
                        }
                    }
                },
                orderBy: {
                    position: "asc",
                }
            },
        }
    });

    if (!course) {
        return redirect("/user/courses");
    }

    const isPurchased = course.purchases.length > 0;

    const validCompletedChapters = await db.userProgress.count({
        where: {
            userId: user.userId,
            chapterId: {
                in: course.chapters.map((chapter) => chapter.id),
            },
            isCompleted: true,
        },
    });

    const progressPercentage =
        (validCompletedChapters / course.chapters.length) * 100 || 0;

    return (
        <div className="flex relative">
            <CourseSidebar
                course={course}
                progressCount={progressPercentage}
                purchased={!!isPurchased}
            />
            <div className="flex-1 md:ml-[250px]">
                <CourseNavbar course={course} purchased={isPurchased} />
                {children}
            </div>
        </div>
    )
}

export default ChapterLayout;