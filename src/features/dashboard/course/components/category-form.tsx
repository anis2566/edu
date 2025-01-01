"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader, Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import { Category, Course } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/loading-button";
import { useGetCategories } from "../api/use-get-categories";
import { useUpdateCourse } from "../api/use-update-course";

interface CourseWithRelations extends Course {
    category: Category | null;
}

interface CategoryFormProps {
    initialData: CourseWithRelations;
    courseId: string;
}

const formSchema = z.object({
    categoryId: z.string().min(1),
});

export const CategoryForm = ({ initialData, courseId }: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState<string>("");

    const toggleEdit = useCallback(() => {
        setIsEditing((current) => !current);
    }, []);

    const { data: categories, isLoading: isLoadingCategories } = useGetCategories(value);

    const { mutate: updateCourse, isPending } = useUpdateCourse({ toggleEdit });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData.categoryId || "",
        },
    });


    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const { title, description, imageUrl, price } = initialData
        updateCourse({
            json: { title, description: description || undefined, imageUrl: imageUrl || undefined, price: price || undefined, categoryId: values.categoryId || undefined },
            param: { id: courseId }
        })
    }

    return (
        <div className="mt-2 rounded-md border bg-card p-4">
            <div className="flex items-center justify-between font-medium">
                <span className="font-semibold">Category</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        "mt-2 text-sm",
                        !initialData.categoryId && "italic text-slate-500",
                    )}
                >
                    {initialData.category?.name || "No Category"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-y-2">
                                    <DropdownMenu>
                                        <FormControl>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="flex justify-start" disabled={isPending || isLoadingCategories}>
                                                    {field.value
                                                        ? categories?.find((category) => category.id === field.value)?.name
                                                        : "Select Category"}
                                                </Button>
                                            </DropdownMenuTrigger>
                                        </FormControl>
                                        <DropdownMenuContent className="w-full min-w-[300px] px-2">
                                            <div className="relative w-full">
                                                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="search"
                                                    placeholder="Search..."
                                                    className="w-full appearance-none bg-background pl-8 shadow-none"
                                                    onChange={(e) => setValue(e.target.value)}
                                                    value={value}
                                                    autoFocus
                                                />
                                            </div>
                                            <DropdownMenuSeparator />
                                            {
                                                isLoadingCategories && (
                                                    <div className="flex justify-center items-center h-20">
                                                        <Loader className="h-4 w-4 animate-spin" />
                                                    </div>
                                                )
                                            }
                                            {!isLoadingCategories && categories?.map((category) => (
                                                <DropdownMenuCheckboxItem
                                                    key={category.id}
                                                    checked={category.id === field.value}
                                                    onCheckedChange={() => field.onChange(category.id)}
                                                >
                                                    {category.name}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
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