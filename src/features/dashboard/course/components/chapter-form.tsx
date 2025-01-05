"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { Chapter } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { useCreateChapter } from "@/features/dashboard/course/chapter/api/use-create-chapter";
import { LoadingButton } from "@/components/loading-button";
import { ChaptersList } from "@/features/dashboard/course/chapter/components/chapter-list";
import { useReorderChapters } from "@/features/dashboard/course/chapter/api/use-reorder-chapters";

interface ChaptersFormProps {
    chapters: Chapter[];
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1, { message: "required" }),
});

export const ChaptersForm = ({ chapters, courseId }: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);

    const toggleCreating = useCallback(() => setIsCreating((current) => !current), []);

    const { mutate: createChapter, isPending } = useCreateChapter({ toggleEdit: toggleCreating });

    const { mutate: reorderChapters, isPending: isReordering } = useReorderChapters();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "" },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createChapter({
            title: values.title,
            courseId,
        });
    }

    const onReorder = useCallback(
        (updateData: { id: string; position: number }[]) => {
            reorderChapters({ json: { list: updateData } });
        },
        [reorderChapters]
    );

    return (
        <div className="relative mt-2 rounded-md border bg-card p-4">
            {(isReordering) && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-500/20 z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
                </div>
            )}

            <div className="flex items-center justify-between font-medium">
                <span className="font-semibold">Chapters</span>
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? "Cancel" : (
                        <>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>

            {isCreating ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            placeholder="e.g. 'Introduction to the course'"
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
            ) : (
                <>
                    <div className={cn("mt-2 text-sm", !chapters.length && "italic text-slate-500")}>
                        {chapters.length ? (
                            <ChaptersList
                                courseId={courseId}
                                onReorder={onReorder}
                                items={chapters}
                            />
                        ) : (
                            "No chapters"
                        )}
                    </div>
                    {chapters.length > 0 && (
                        <p className="mt-4 text-xs text-muted-foreground">
                            Drag and drop to reorder the chapters
                        </p>
                    )}
                </>
            )}
        </div>
    );
};