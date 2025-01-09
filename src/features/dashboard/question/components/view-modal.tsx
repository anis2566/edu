"use client"

import { Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

import { useDeleteAnswer, useQuestionReply, useViewQuestion } from "@/hooks/use-question"

export const ViewQuestionModal = () => {
    const { isOpen, question, onClose } = useViewQuestion()
    const { onOpen: onOpenReply } = useQuestionReply()
    const { onOpen: onOpenDeleteAnswer } = useDeleteAnswer()

    const handleReply = () => {
        if (question) {
            onClose()
            onOpenReply(question, question?.id)
        }
    }

    const handleDeleteAnswer = (id: string) => {
        onClose()
        onOpenDeleteAnswer(id)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>View Question</DialogTitle>
                    <DialogDescription>View the question details here</DialogDescription>
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
                    <Button onClick={handleReply}>Reply</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}