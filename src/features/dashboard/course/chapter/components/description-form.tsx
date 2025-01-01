"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import { Chapter } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";

import { cn } from "@/lib/utils";
import { useUpdateChapter } from "../api/use-update-chapter";

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(5, { message: "Description is required" }),
});

export const DescriptionForm = ({
  initialData,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

  const { mutate: updateChapter, isPending } = useUpdateChapter({ toggleEdit });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const {title, videoUrl, videoThumbnail} = initialData
    updateChapter({
      param: { chapterId },
      json: { title, videoUrl: videoUrl || undefined, videoThumbnail: videoThumbnail || undefined, description: values.description },
    });
  };

  return (
    <div className="mt-2 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        <span className="font-semibold">Description</span>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData.description && "italic text-slate-500",
          )}
        >
          {initialData.description ? (
            <p>{initialData.description}</p>
          ) : (
            "No description"
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} />
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