import {
    Chapter,
    Course,
    UserProgress,
} from "@prisma/client";

import { CourseSidebarItem } from "./sidebar-item";
import { CourseProgress } from "./course-progress";

interface ChapterWithProgress extends Chapter {
    userProgress: UserProgress[];
}

interface CourseWithCahpter extends Course {
    chapters: ChapterWithProgress[];
}

interface Props {
    course: CourseWithCahpter;
    progressCount: number;
    purchased: boolean;
}

export const CourseSidebar = ({ course, progressCount, purchased }: Props) => {
    return (
        <div className="hidden h-full flex-col overflow-y-auto border-r shadow-sm md:flex w-[250px]">
            <div className="flex flex-col border-b px-8 py-4">
                <h1 className="font-semibold w-full max-w-[200px] truncate">{course.title}</h1>
                {purchased && (
                    <div className="mt-10">
                        <CourseProgress variant="success" value={progressCount} />
                    </div>
                )}
            </div>
            <div className="flex w-full flex-col">
                {course.chapters.map((chapter, index) => {
                    // let isPreviousChapterCompleted = false;

                    // if (index === 0) {
                    //   isPreviousChapterCompleted = true;
                    // } else {
                    //   const previousChapter = course.chapters[index - 1];
                    //   if (previousChapter.assignments) {
                    //     isPreviousChapterCompleted = previousChapter.submissions.some(
                    //       (item) => item.status === SubmissionStatus.Accepted
                    //     );
                    //   } else {
                    //     isPreviousChapterCompleted = true;
                    //   }
                    // }

                    return (
                        <CourseSidebarItem
                            key={chapter.id}
                            id={chapter.id}
                            label={chapter.title}
                            isCompleted={!!chapter?.userProgress?.[0]?.isCompleted}
                            courseId={course.id}
                            isLocked={!chapter.isFree && !purchased}
                            isPreviousChapterCompleted={false}
                            purchased={purchased}
                        />
                    )
                })}
            </div>
        </div>
    );
};