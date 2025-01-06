"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TagsInput } from "@/components/ui/tag-input"

import { LoadingButton } from "@/components/loading-button"
import { CategorySchema, CategorySchemaType } from "../schema"
import { useCreateCategory } from "../api/use-create-category"
import { UploadDropzone } from "@/components/uploadthing"

export const CategoryForm = () => {
    const { mutate, isPending } = useCreateCategory()

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: "",
            imageUrl: "",
            description: "",
            tags: []
        }
    })

    const onSubmit = (values: CategorySchemaType) => {
        mutate(values)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Category</CardTitle>
                <CardDescription>Add new category to the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    {
                                        form.watch("imageUrl") ? (
                                            <div className="relative">
                                                <div className="relative aspect-square max-h-[100px]">
                                                    <Image src={form.getValues("imageUrl")} alt="Profile" fill className="object-contain rounded-full" />
                                                </div>
                                                <Button type="button" variant="destructive" className="absolute right-0 top-0" onClick={() => form.setValue("imageUrl", "")}>
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <FormControl>
                                                <UploadDropzone
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(res) => {
                                                        field.onChange(res[0].url);
                                                        toast.success("Image uploaded");
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast.error("Image upload failed");
                                                    }}
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                        )
                                    }
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <TagsInput
                                            value={field.value || []}
                                            onValueChange={field.onChange}
                                            placeholder="Enter tags"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            isLoading={isPending}
                            title="Create"
                            loadingTitle="Creating..."
                            onClick={form.handleSubmit(onSubmit)}
                            type="submit"
                            icon={Send}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )

}