"use client"

import { formatDistanceToNow } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send } from "lucide-react"
import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormItem, FormControl, FormField } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { useDeleteAnswer, useQuestionReply } from "@/hooks/use-question"
import { LoadingButton } from "@/components/loading-button"
import { useCreateAnswer } from "../api/use-create-answer"

const schema = z.object({
    answer: z.string().min(1, { message: "Answer is required" }),
})

type Schema = z.infer<typeof schema>


export const QuestionReplyModal = () => {
    const [id, setId] = useState<string>("")

    const { isOpen, question, questionId, onClose } = useQuestionReply()
    const { onOpen: onOpenDeleteAnswer } = useDeleteAnswer()

    useEffect(() => {
        if (questionId) {
            setId(questionId)
        }
    }, [questionId])

    const handleDeleteAnswer = (id: string) => {
        onClose()
        onOpenDeleteAnswer(id)
    }

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


    const onSubmit = (data: Schema) => {
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
                    <DialogDescription>Reply to the question here</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex space-x-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={question?.user?.image || ""}
                                    alt={question?.user?.name || ""}
                                />
                                <AvatarFallback>
                                    {question?.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{question?.user?.name || "User"}</h3>
                                    <p className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(question?.createdAt || new Date()), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-700">{question?.question}</p>
                            </div>

                        </div>
                        {question?.answers.map((answer) => (
                            <div className="ml-12 space-y-4" key={answer.id}>
                                <div className="flex space-x-4">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={answer.user.image || ""}
                                            alt={answer.user.name || ""}
                                        />
                                        <AvatarFallback>
                                            {answer.user.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <div className="flex flex-col">
                                                <h4 className="font-semibold">{answer.user.name}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {formatDistanceToNow(new Date(answer.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAnswer(answer.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-2">{answer.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex gap-x-4">
                            <FormField
                                control={form.control}
                                name="answer"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Textarea placeholder="Answer" {...field} disabled={isPending} />
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
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}