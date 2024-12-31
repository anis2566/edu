"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { LoadingButton } from "@/components/loading-button";
import { useCreateCourse } from "../api/use-create-course";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "required",
    }),
});

export const CourseForm = () => {
    const { mutate: createCourse, isPending } = useCreateCourse();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        createCourse(values);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Name your course</CardTitle>
                <CardDescription>
                    What would you like to name your course? Don&apos;t worry, you can
                    change this later.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course title</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <LoadingButton
                                type="submit"
                                title="Continue"
                                loadingTitle="Creating course..."
                                isLoading={isPending}
                                onClick={form.handleSubmit(onSubmit)}
                                icon={Send}
                            />
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};