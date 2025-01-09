"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Trash, Eye } from "lucide-react";
import { useState, useCallback } from "react";
import { Attachment } from "@prisma/client";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { useCreateAttachment } from "../api/use-create-attachment";
import { LoadingButton } from "@/components/loading-button";
import { useDeleteAttachment } from "@/hooks/use-attachment";
import { UploadDropzone } from "@/components/uploadthing";
import Link from "next/link";

interface Props {
    attachments: Attachment[];
    chapterId: string;
}

const formSchema = z.object({
    title: z.string().min(1, { message: "required" }),
    url: z.string().min(1, { message: "required" }),
});

export const AttachmentsForm = ({ attachments, chapterId }: Props) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

    const { onOpen } = useDeleteAttachment();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", url: "" },
    });

    const { mutate: createAttachment, isPending } = useCreateAttachment({ toggleEdit, form });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createAttachment({ json: { title: values.title, url: values.url }, param: { chapterId } });
    };

    return (
        <div className="mt-2 rounded-md border bg-card p-4">
            <div className="flex items-center justify-between font-medium">
                <span className="font-semibold">Attachments</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : (
                        <>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && attachments.length === 0 && (
                <p className="mt-2 text-sm italic text-slate-500">
                    No attachments
                </p>
            )}

            {!isEditing && attachments.length > 0 && (
                <div className="mt-2 space-y-3">
                    {attachments.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-sm border-2 p-2">
                            <p>
                                {item.title}
                            </p>
                            <div className="flex items-center gap-x-2">
                                {item.url && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button asChild variant="outline" size="icon">
                                                    <Link href={item.url} target="_blank">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>View File</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="flex-shrink-0"
                                                onClick={() => onOpen(item.id)}
                                            >
                                                <Trash className="h-5 w-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete attachment</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Attachment</FormLabel>
                                    <FormControl>
                                        {field.value ? (
                                            <div className="flex items-center gap-x-3">
                                                <Link href={field.value} target="_blank" className="hover:underline">
                                                    View File
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => form.setValue("url", "")}
                                                    type="button"
                                                    disabled={isPending}
                                                >
                                                    <Trash className="text-rose-500" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <UploadDropzone
                                                endpoint="pdfUploader"
                                                onClientUploadComplete={(res) => {
                                                    field.onChange(res[0].url);
                                                    toast.success("Attachment uploaded");
                                                }}
                                                onUploadError={(error: Error) => {
                                                    toast.error("Attachment upload failed");
                                                }}
                                                disabled={isPending}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <LoadingButton
                                isLoading={isPending}
                                title="Save"
                                loadingTitle="Saving..."
                                onClick={form.handleSubmit(onSubmit)}
                                type="submit"
                            />
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};