"use client"

import { DeleteCategoryModal } from "@/features/dashboard/category/components/delete-modal"
import { DeleteAttachmentModal } from "@/features/dashboard/course/chapter/components/delete-attachment-modal"
import { UploadModal } from "@/features/dashboard/course/chapter/components/upload-modal"
import { DeleteChapterModal } from "@/features/dashboard/course/chapter/components/delete-modal"

export const ModalProvider = () => {
    return (
        <>
            <DeleteCategoryModal />
            <DeleteAttachmentModal />
            <UploadModal />
            <DeleteChapterModal />
        </>
    )
}
