"use client";

import * as z from "zod";
import { Pencil, PlusCircle, ImageIcon, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Course } from "@prisma/client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { ImageUploader } from "@/components/ui/image-uploader";
import { useUpdateCourse } from "../api/use-update-course";
import { LoadingButton } from "@/components/loading-button";

interface ImageFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "required",
    }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = useCallback(() => {
        setIsEditing((current) => !current);
    }, []);

    const { mutate: updateCourse, isPending } = useUpdateCourse({ toggleEdit });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const { title, description, price, categoryId } = initialData;
        updateCourse({
            json: { title, description: description || undefined, price: price || undefined, imageUrl: values.imageUrl, categoryId: categoryId || undefined },
            param: { id: courseId },
        });
    };

    return (
        <div className="mt-6 rounded-md border bg-card p-4">
            <div className="flex items-center justify-between font-medium">
                <span className="font-semibold">Thumbnail</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : (
                        <>
                            {initialData.imageUrl ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            {initialData.imageUrl ? "Edit" : "Add"}
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                initialData.imageUrl ? (
                    <div className="relative mt-2 aspect-video">
                        <Image
                            alt="Upload"
                            fill
                            className="rounded-md object-cover"
                            src={initialData.imageUrl}
                        />
                    </div>
                ) : (
                    <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                )
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-8 space-y-4"
                    >
                        <div>
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {form.getValues("imageUrl") ? (
                                                <div className="relative mt-2 aspect-video">
                                                    <Image
                                                        alt="Upload"
                                                        fill
                                                        className="rounded-md object-cover"
                                                        src={form.getValues("imageUrl")}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0"
                                                        onClick={() => form.setValue("imageUrl", "")}
                                                    >
                                                        <Trash2 className="h-5 w-5 text-rose-500" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <ImageUploader
                                                    preset="Course"
                                                    onChange={values => {
                                                        field.onChange(values[0])
                                                    }}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4 text-xs text-muted-foreground">
                                16:9 aspect ratio recommended
                            </div>
                            <div className="flex justify-end">
                                <LoadingButton
                                    isLoading={isPending}
                                    title="Save"
                                    loadingTitle="Saving..."
                                    onClick={form.handleSubmit(onSubmit)}
                                    type="submit"
                                />
                            </div>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};