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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUpdateCourse } from "../api/use-update-course";
import { LoadingButton } from "@/components/loading-button";

interface TitleFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1, { message: "required" }),
});

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = useCallback(() => {
        setIsEditing((current) => !current);
    }, []);

    const { mutate: updateCourse, isPending } = useUpdateCourse({ toggleEdit });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: initialData.title },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updateCourse({
            json: { title: values.title },
            param: { id: courseId },
        });
    };

    return (
        <div className="mt-6 rounded-md border bg-card p-4">
            <div className="flex items-center justify-between font-medium">
                <span className="font-semibold">Title</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : (
                        <>
                            <Pencil className="mr-0 h-4 w-4" />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            {!isEditing ? (
                <p className="mt-2 text-sm">{initialData.title}</p>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="e.g. 'Advanced web development'"
                                            {...field}
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