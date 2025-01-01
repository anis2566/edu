"use client"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { LoadingButton } from "@/components/loading-button";
import { useDeleteAttachment as useDeleteAttachmentApi } from "../api/use-delete-attachment";
import { useDeleteAttachment } from "@/hooks/use-attachment";

export const DeleteAttachmentModal = () => {
    const { isOpen, attachmentId, onClose } = useDeleteAttachment();

    const { mutate, isPending } = useDeleteAttachmentApi({ onClose })

    const handleDelete = () => {
        mutate({ param: { attachmentId } });
    }

    return (
        <AlertDialog open={isOpen && !!attachmentId} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your attachment
                        and remove your data from servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <LoadingButton
                        isLoading={isPending}
                        title="Delete"
                        loadingTitle="Deleting..."
                        onClick={handleDelete}
                        variant="destructive"
                        type="button"
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}