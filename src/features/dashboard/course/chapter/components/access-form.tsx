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
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";
import { useUpdateChapter } from "../api/use-update-chapter";
import { LoadingButton } from "@/components/loading-button";

interface ChapterAccessFormProps {
  initialData: Chapter;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export const AccessForm = ({
  initialData,
  chapterId,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

    const { mutate: updateChapter, isPending } = useUpdateChapter({ toggleEdit });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: initialData.isFree || false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const {title, description, videoUrl, videoThumbnail} = initialData
    updateChapter({
      param: { chapterId },
      json: {title, description: description || undefined, videoUrl: videoUrl || undefined, videoThumbnail: videoThumbnail || undefined, isFree: values.isFree },
    });
  };

  return (
    <div className="mt-2 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        <span className="font-semibold">Access</span>
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
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.isFree && "italic text-slate-500",
          )}
        >
          {initialData.isFree ? "This chapter is free for preview." : "This chapter is not free."}
        </p>
      )}
      
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Toggle this box to make the chapter free for preview
                    </FormDescription>
                  </div>
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