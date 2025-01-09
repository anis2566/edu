"use client"

import { DeleteCategoryModal } from "@/features/dashboard/category/components/delete-modal"
import { DeleteAttachmentModal } from "@/features/dashboard/course/chapter/components/delete-attachment-modal"
import { UploadModal } from "@/features/dashboard/course/chapter/components/upload-modal"
import { DeleteChapterModal } from "@/features/dashboard/course/chapter/components/delete-modal"
import { DeleteCourseModal } from "@/features/dashboard/course/components/delete-modal"
import { QuestionModal } from "@/features/user/courses/chapter/components/question-modal"
import { DeleteQuestionModal } from "@/features/dashboard/question/components/delete-modal"
import { ViewQuestionModal } from "@/features/dashboard/question/components/view-modal"
import { QuestionReplyModal } from "@/features/dashboard/question/components/reply-modal"
import { DeleteAnswerModal } from "@/features/dashboard/question/components/delete-answer-modal"
import { QuestionReplyModalUser } from "@/features/user/courses/chapter/components/reply-modal"
import { DeleteAssignmentModal } from "@/features/dashboard/course/chapter/components/delete-assignment-modal"

export const ModalProvider = () => {
    return (
        <>
            <DeleteCategoryModal />
            <DeleteAttachmentModal />
            <UploadModal />
            <DeleteChapterModal />
            <DeleteCourseModal />
            <QuestionModal />
            <ViewQuestionModal />
            <QuestionReplyModal />
            <DeleteQuestionModal />
            <DeleteAnswerModal />
            <QuestionReplyModalUser />
            <DeleteAssignmentModal />
        </>
    )
}
