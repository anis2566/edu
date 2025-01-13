"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmissionStatus } from "@prisma/client";
import { useEffect } from "react";
import { Send } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useSubmissionStatus } from "@/hooks/use-submission";
import { LoadingButton } from "@/components/loading-button";
import { useUpdateSubmission } from "../api/use-update-submission";

const formSchema = z.object({
    status: z
        .nativeEnum(SubmissionStatus)
        .refine((data) => Object.values(SubmissionStatus).includes(data), {
            message: "required",
        }),
    feedback: z.string().min(1, { message: "required" }),
});

type FormSchema = z.infer<typeof formSchema>;

export const SubmissionStatusModal = () => {
    const { isOpen, submissionId, status, onClose } = useSubmissionStatus();

    useEffect(() => {
        if (isOpen) {
            form.reset({
                status: status,
                feedback: "",
            });
        }
    }, [isOpen]);

    const { mutate: updateSubmission, isPending } = useUpdateSubmission({ onClose });

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: undefined,
            feedback: "",
        },
    });

    const handleSubmit = async (data: FormSchema) => {
        updateSubmission({
            json: data,
            param: { id: submissionId },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submission Status</DialogTitle>
                    <DialogDescription>
                        View the status of your submission
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(SubmissionStatus).map((status) => (
                                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="feedback"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Feedback</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} rows={5} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Update"
                            loadingTitle="Updating..."
                            isLoading={isPending}
                            onClick={form.handleSubmit(handleSubmit)}
                            icon={Send}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}