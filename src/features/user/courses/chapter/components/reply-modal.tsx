"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send } from "lucide-react"
import { useEffect, useState } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { LoadingButton } from "@/components/loading-button"

import { useQuestionReplyUser } from "@/hooks/use-question"
import { useCreateAnswer } from "@/features/dashboard/question/api/use-create-answer"

const schema = z.object({
    answer: z.string().min(1, { message: "Answer is required" }),
})

type Schema = z.infer<typeof schema>

export const QuestionReplyModalUser = () => {
    const [id, setId] = useState<string>("")

    const { isOpen, onClose, questionId } = useQuestionReplyUser()

    useEffect(() => {
        setId(questionId)
    }, [questionId])

    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            answer: "",
        },
    })

    const { mutate: createAnswer, isPending } = useCreateAnswer({
        onClose,
        form,
    })

    const onSubmit = async (data: Schema) => {
        createAnswer({
            json: { answer: data.answer },
            param: { questionId: id },
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reply to Question</DialogTitle>
                    <DialogDescription>Reply to the question</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Textarea rows={6} placeholder="Answer" {...field} disabled={isPending} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            title="Reply"
                            loadingTitle="Replying..."
                            isLoading={isPending}
                            onClick={form.handleSubmit(onSubmit)}
                            icon={Send}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}