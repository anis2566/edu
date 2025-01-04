import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export const metadata: Metadata = {
    title: "EduConnect | Course | Details",
    description: "Next generation learning platform.",
};

interface Props {
    params: Promise<{ id: string }>
}

const Course = async ({ params }: Props) => {
    const { id } = (await params)

    const course = await db.course.findUnique({
        where: { id },
        include: {
            category: true,
            chapters: {
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!course) {
        return redirect("/user/courses");
    }

    return redirect(`/user/courses/${course.id}/chapters/${course.chapters[0].id}`);

};

export default Course;