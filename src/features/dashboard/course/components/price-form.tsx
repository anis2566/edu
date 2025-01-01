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

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useUpdateCourse } from "../api/use-update-course";
import { LoadingButton } from "@/components/loading-button";

interface PriceFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number().min(0, "Price must be a positive number"),
});

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = useCallback(() => setIsEditing((current) => !current), []);

    const { mutate: updateCourse, isPending } = useUpdateCourse({ toggleEdit });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || 0,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const { title, imageUrl, categoryId, description } = initialData;
        updateCourse({
            json: {
                title,
                imageUrl: imageUrl || undefined,
                price: values.price,
                description: description || undefined,
                categoryId: categoryId || undefined,
            },
            param: { id: courseId },
        });
    }

    return (
        <div className="mt-2 rounded-md border bg-card p-4">
            <div className="flex items-center justify-between font-medium">
                <span className="font-semibold">Price</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? "Cancel" : <><Pencil className="mr-2 h-4 w-4" /> Edit</>}
                </Button>
            </div>

            {!isEditing && (
                <p className={cn("mt-2 text-sm", !initialData.price && "italic text-slate-500")}>
                    {initialData.price ? formatPrice(initialData.price) : "No price"}
                </p>
            )}

            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            disabled={isPending}
                                            placeholder="Set a price for your course"
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