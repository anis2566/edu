"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn, formatPrice } from "@/lib/utils";
import { useCreatePayment } from "@/features/server/api/payment/use-create-payment";
import { useToggleComplete } from "@/features/dashboard/course/chapter/api/use-toggle-complete";

interface Props {
    nextChapterId: string;
    previousChapterId: string;
    courseId: string;
    isPurchased: boolean;
    price: number;
    chapterId: string;
    isCompleted: boolean;
}

export const VideoController = ({
    nextChapterId,
    courseId,
    previousChapterId,
    isPurchased,
    price,
    chapterId,
    isCompleted
}: Props) => {
    const { mutate: createPayment, isPending } = useCreatePayment();
    const { mutate: toggleComplete, isPending: isToggleCompletePending } = useToggleComplete();

    const handleEnroll = () => {
        createPayment({
            courseId,
            amount: price,
        });
    };

    const handleToggleComplete = () => {
        toggleComplete({
            param: { chapterId },
            json: { isCompleted: !isCompleted },
        });
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                {previousChapterId ? (
                    <Link
                        href={`/user/courses/${courseId}/chapters/${previousChapterId}`}
                        className={cn(buttonVariants({ variant: "outline" }))}
                    >
                        <ChevronLeft />
                        Previous
                    </Link>
                ) : (
                    <Button disabled variant="outline">
                        <ChevronLeft />
                        Previous
                    </Button>
                )}
                {nextChapterId ? (
                    <Link
                        href={`/user/courses/${courseId}/chapters/${nextChapterId}`}
                        className={cn(buttonVariants({ variant: "outline" }))}
                    >
                        Next
                        <ChevronRight />
                    </Link>
                ) : (
                    <Button disabled variant="outline">
                        Next
                        <ChevronRight />
                    </Button>
                )}
            </div>
            {
                isPurchased ? (

                    <Button
                        variant="outline"
                        onClick={handleToggleComplete}
                        disabled={isToggleCompletePending}
                    >
                        {isCompleted ? "Mark as Uncomplete" : "Mark as Complete"}
                    </Button>
                ) : (
                    <Button onClick={handleEnroll} disabled={isPending}>
                        Enroll with {formatPrice(price)}
                    </Button>
                )
            }
        </div>
    );
};