"use client"

import { DeleteCategoryModal } from "@/features/dashboard/category/components/delete-modal"
import { DeleteAttachmentModal } from "@/features/dashboard/course/chapter/components/delete-attachment-modal"
import { UploadModal } from "@/features/dashboard/course/chapter/components/upload-modal"

export const ModalProvider = () => {
    return (
        <>
            <DeleteCategoryModal />
            <DeleteAttachmentModal />
            <UploadModal />
        </>
    )
}
