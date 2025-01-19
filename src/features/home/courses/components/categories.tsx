"use client";

import Image from "next/image";
import { SetStateAction, Dispatch } from "react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import { useGetCategories } from "@/features/home/courses/api/use-get-categories";

interface CategoriesProps {
    categoryId?: string;
    setCategoryId: Dispatch<SetStateAction<string | undefined>>;
}

export const Categories = ({ categoryId, setCategoryId }: CategoriesProps) => {

    const { data } = useGetCategories();

    return (
        <ScrollArea>
            <div className="flex flex-1 items-center justify-center gap-x-3 whitespace-nowrap pb-3">
                {data?.map((category) => {
                    const active = categoryId === category.id;
                    return (
                        <Badge
                            key={category.id}
                            className={cn(
                                "flex h-10 cursor-pointer items-center gap-x-2 rounded-full border-primary py-2 px-4",
                            )}
                            variant={active ? "default" : "outline"}
                            onClick={() => setCategoryId(active ? undefined : category.id)}
                        >
                            <Image
                                src={category.imageUrl}
                                alt="Category"
                                height={20}
                                width={20}
                                className="rounded-full"
                            />
                            {category.name}
                        </Badge>
                    );
                })}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
};

