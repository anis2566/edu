"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import { Course } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { useUpdateCourse } from "../api/use-update-course";
import { LoadingButton } from "@/components/loading-button";
import RichTextEditor from "@/components/tiptap-editor";

interface DescriptionFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    description: z.string().min(1, {
        message: "required",
    }),
});

export const DescriptionForm = ({
    initialData,
    courseId,
}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = useCallback(() => {
        setIsEditing((current) => !current);
    }, []);

    const { mutate: updateCourse, isPending } = useUpdateCourse({ toggleEdit });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const { title, imageUrl, price, categoryId } = initialData;
        updateCourse({
            json: {
                title,
                imageUrl: imageUrl || undefined,
                price: price || undefined,
                description: values.description,
                categoryId: categoryId || undefined,
            },
            param: { id: courseId },
        });
    };

    return (
        <div className="mt-2 rounded-md border bg-card p-4">
            <div className="flex items-center justify-between font-medium">
                <span className="font-semibold">Description</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : (
                        <>
                            <Pencil className="h-4 w-4" />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            {!isEditing ? (
                <p
                    className={cn(
                        "mt-2 text-sm",
                        !initialData.description && "italic text-slate-500"
                    )}
                >
                    {initialData.description || "No description"}
                </p>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
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