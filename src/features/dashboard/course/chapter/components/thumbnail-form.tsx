"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageIcon, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Chapter } from "@prisma/client";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";

import { useUpdateChapter } from "../api/use-update-chapter";
import { LoadingButton } from "@/components/loading-button";

interface ThumbnailFormProps {
  initialData: Chapter;
  chapterId: string;
}

const formSchema = z.object({
  videoThumbnail: z.string().min(1, { message: "Image is required" }),
});

export const ThumbnailForm = ({ initialData, chapterId }: ThumbnailFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const toggleEdit = useCallback(() => setIsEditing((prev) => !prev), []);

    const { mutate: updateChapter, isPending } = useUpdateChapter({ toggleEdit });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { videoThumbnail: initialData.videoThumbnail || "" },
  });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      const {title, videoUrl, description} = initialData
    updateChapter({
      param: { chapterId },
      json: { title, videoUrl: videoUrl || undefined, videoThumbnail: values.videoThumbnail || undefined, description: description || undefined },
    });
  };

  return (
    <div className="mt-2 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        <span className="font-semibold">Thumbnail</span>
        <Button onClick={() => setIsEditing((prev) => !prev)} variant="ghost">
          {isEditing ? "Cancel" : (initialData.videoThumbnail ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
          {isEditing ? "Cancel" : (initialData.videoThumbnail ? "Edit" : "Add an image")}
        </Button>
      </div>
      {!isEditing ? (
        initialData.videoThumbnail ? (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={initialData.videoThumbnail}
            />
          </div>
        ) : (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        )
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <FormField
              control={form.control}
              name="videoThumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {field.value ? (
                      <div className="relative mt-2 aspect-video">
                        <Image
                          alt="Upload"
                          fill
                          className="rounded-md object-cover"
                          src={field.value}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => field.onChange("")}
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
          </form>
        </Form>
      )}
    </div>
  );
};