import { Metadata } from "next";

import { ChapterPage } from "@/features/user/courses/chapter/components/chapter-page";

export const metadata: Metadata = {
    title: "EduConnect | Course | Chapter",
    description: "Next generation learning platform.",
};

interface Props {
    params: Promise<{ id: string, chapterId: string }>
}

const Chapter = async ({ params }: Props) => {
    const { chapterId, id } = (await params)

    return (
        <div className="p-4">
            <ChapterPage chapterId={chapterId} courseId={id} />
        </div>
    )
}

export default Chapter;