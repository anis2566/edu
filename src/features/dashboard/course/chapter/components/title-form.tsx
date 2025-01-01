"use client";

import * as z from "zod";
import { Chapter } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState, useCallback } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUpdateChapter } from "../api/use-update-chapter";
import { LoadingButton } from "@/components/loading-button";

interface ChapterTitleFormProps {
  initialData: Chapter;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export const TitleForm = ({
  initialData,
  chapterId,
}: ChapterTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

  const { mutate: updateChapter, isPending } = useUpdateChapter({ toggleEdit });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: initialData.title },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateChapter({
      param: { chapterId },
      json: { title: values.title },
    });
  };

  return (
    <div className="mt-2 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        <span className="font-semibold">
          Title
        </span>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="mt-2 text-sm">{initialData.title}</p>}
      {isEditing && (
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