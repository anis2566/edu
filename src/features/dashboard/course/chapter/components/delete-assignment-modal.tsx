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
import { useDeleteAssignment as useDeleteAssignmentApi } from "../api/use-delete-assignment";
import { useDeleteAssignment } from "@/hooks/use-assignment";

export const DeleteAssignmentModal = () => {
    const { isOpen, assignmentId, onClose } = useDeleteAssignment();

    const { mutate, isPending } = useDeleteAssignmentApi({ onClose })

    const handleDelete = () => {
        mutate({ param: { assignmentId } });
    }

    return (
        <AlertDialog open={isOpen && !!assignmentId} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your assignment
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