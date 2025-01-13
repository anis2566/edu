"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Send, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { useSubmission } from "@/hooks/use-submission";
import { UploadButton } from "@/components/uploadthing";
import { LoadingButton } from "@/components/loading-button";
import { useCreateSubmission } from "../api/use-create-submission";

const formSchema = z.object({
    fileUrl: z.string().min(1, { message: "File is required" }),
});

type FormSchema = z.infer<typeof formSchema>;

export const SubmissionModal = () => {
    const { isOpen, assignmentId, onClose } = useSubmission();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        },
    });

    const { mutate: createSubmission, isPending } = useCreateSubmission({
        onClose,
        form,
    });

    const onSubmit = async (values: FormSchema) => {
        createSubmission({
            json: {
                fileUrl: values.fileUrl,
                assignmentId,
            },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit Assignment</DialogTitle>
                    <DialogDescription>Submit your assignment here</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fileUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        {field.value ? (
                                            <div className="flex items-center gap-x-3">
                                                <Link
                                                    href={field.value}
                                                    className="hover:underline"
                                                    target="_blank"
                                                >
                                                    View File
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => form.setValue("fileUrl", "")}
                                                    type="button"
                                                    disabled={isPending}
                                                >
                                                    <Trash className="text-rose-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <UploadButton
                                                endpoint="pdfUploader"
                                                onClientUploadComplete={(res) => {
                                                    field.onChange(res[0].url);
                                                    toast.success("File uploaded");
                                                }}
                                                onUploadError={(error: Error) => {
                                                    console.log(error);
                                                    toast.error("File upload failed");
                                                }}
                                                disabled={isPending}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Submit"
                            loadingTitle="Submitting..."
                            isLoading={isPending}
                            onClick={form.handleSubmit(onSubmit)}
                            icon={Send}
                            className="w-full"
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}