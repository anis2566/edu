"use client"

import { BookOpen, MessageCircle, Star, User } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { useViewReview } from "@/hooks/use-review";

export const ReviewViewModal = () => {
    const { review, isOpen, onClose } = useViewReview();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review</DialogTitle>
                    <DialogDescription>Review Details</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full shrink-0">
                            <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <p>{review?.courseName}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full shrink-0">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                        <p>{review?.userName}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full shrink-0">
                            <Star className="w-4 h-4 text-primary" />
                        </div>
                        <p>{review?.rating}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-full shrink-0">
                            <MessageCircle className="w-4 h-4 text-primary" />
                        </div>
                        <p>{review?.content}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}