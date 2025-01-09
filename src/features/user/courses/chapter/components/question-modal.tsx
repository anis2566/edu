"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { LoadingButton } from "@/components/loading-button";
import { useAddQuestion } from "@/hooks/use-question";
import { useCreateQuestion } from "../api/use-create-question";

const formSchema = z.object({
    question: z.string().min(1, { message: "Question is required" }),
    chapterId: z.string().min(1, { message: "Chapter is required" }),
});

type QuestionSchemaType = z.infer<typeof formSchema>;

export const QuestionModal = () => {
    const { isOpen, chapterId, onClose } = useAddQuestion();

    useEffect(() => {
        if (isOpen) {
            form.reset({
                question: "",
                chapterId: chapterId,
            });
        }
    }, [chapterId]);

    const { mutate: createQuestion, isPending } = useCreateQuestion({ onClose });

    const form = useForm<QuestionSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            chapterId: "",
        },
    });

    const onSubmit = (values: QuestionSchemaType) => {
        createQuestion({
            json: {
                question: values.question,
            },
            param: {
                chapterId: values.chapterId,
            },
        });
    }

    return (
        <Dialog open={isOpen || !!chapterId} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ask a question</DialogTitle>
                    <DialogDescription>
                        Ask a question about this chapter
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Ask a question about this book" rows={5} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            className="w-full"
                            isLoading={isPending}
                            title="Submit"
                            loadingTitle="Submitting..."
                            onClick={form.handleSubmit(onSubmit)}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};