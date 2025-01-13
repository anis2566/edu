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
import { useDeleteSubmission } from "@/hooks/use-submission";
import { useDeleteSubmission as useDeleteSubmissionApi } from "../api/use-delete-submission";

export const DeleteSubmissionModal = () => {
    const { isOpen, submissionId, onClose } = useDeleteSubmission();

    const { mutate, isPending } = useDeleteSubmissionApi({ onClose })

    const handleDelete = () => {
        mutate({ param: { id: submissionId } });
    }

    return (
        <AlertDialog open={isOpen && !!submissionId} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your submission
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