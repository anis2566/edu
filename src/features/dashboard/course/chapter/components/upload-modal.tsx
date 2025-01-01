"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { useOpenUpload } from "@/hooks/use-chapter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUploadVideo } from "../api/use-upload-video";

const formSchema = z.object({
    file: z.instanceof(File, { message: "required" }),
});

export const UploadModal = () => {
    const { isOpen, onClose, chapterId } = useOpenUpload();

    const { mutate: uploadVideo } = useUploadVideo(chapterId);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            file: undefined,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        uploadVideo({ form: values, param: { chapterId } });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Video</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="video">Video</Label>
                                            <Input
                                                id="video"
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        field.onChange(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Upload</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};