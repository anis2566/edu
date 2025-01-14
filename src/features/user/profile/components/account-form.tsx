"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LoadingButton } from "@/components/loading-button";
import { UserSchema } from "../schema";
import { useUpdateUser } from "../api/use-update-user";
import { GENDER } from "@/constant";

interface AccountFormProps {
    user: User;
}

export const AccountForm = ({ user }: AccountFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = () => setIsEditing((prev) => !prev);

    const { mutate: updateUser, isPending } = useUpdateUser({ toggleEditing });

    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: user.name ?? "",
            gender: user.gender as GENDER ?? undefined,
            dob: user.dob ?? undefined,
            email: user.email ?? "",
            phone: user.phone ?? "",
            image: user.image ?? "",
        }
    });

    const onSubmit = (data: z.infer<typeof UserSchema>) => {
        updateUser({
            json: data
        })
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center gap-x-2">
                    <span>Account Information</span>
                    <Button variant={isEditing ? "destructive" : "secondary"} onClick={toggleEditing} disabled={isPending}>
                        {isEditing ? "Cancel" : "Update"}
                    </Button>
                </CardTitle>
                <CardDescription>
                    You can edit your account information here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {
                            isEditing && (
                                <LoadingButton
                                    type="submit"
                                    isLoading={isPending}
                                    title="Save"
                                    loadingTitle="Saving..."
                                    onClick={form.handleSubmit(onSubmit)}
                                />
                            )
                        }
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}