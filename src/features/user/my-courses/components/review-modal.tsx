"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rating } from "@smastrom/react-rating";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { ReviewSchema } from "@/features/user/my-courses/schema";
import { LoadingButton } from "@/components/loading-button";
import { useReview } from "@/hooks/use-review";
import { useCreateReview } from "../api/use-create-review";


export const ReviewModal = () => {
    const { isOpen, courseId, onClose } = useReview();

    const form = useForm<z.infer<typeof ReviewSchema>>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: {
            rating: 0,
            content: "",
        },
    });

    const { mutate: createReview, isPending } = useCreateReview({ onClose });

    const onSubmit = async (values: z.infer<typeof ReviewSchema>) => {
        createReview({ json: values, param: { courseId } });
    };

    return (
        <Dialog open={isOpen && !!courseId} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Leave a Review</DialogTitle>
                    <DialogDescription>
                        Please leave a review for the course.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <Rating
                                            style={{ maxWidth: 180 }}
                                            value={field.value}
                                            onChange={field.onChange}
                                            transition="zoom"
                                            isDisabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Review</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} rows={5} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            isLoading={isPending}
                            loadingTitle="Submitting..."
                            title="Submit"
                            onClick={form.handleSubmit(onSubmit)}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};