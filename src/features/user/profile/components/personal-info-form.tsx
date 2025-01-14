"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/loading-button";
import { GENDER } from "@/constant";
import { UserSchema } from "@/features/user/profile/schema";
import { useUpdateUser } from "../api/use-update-user";

interface PersonalInfoFormProps {
    user: User
}

export const PersonalInfoForm = ({ user }: PersonalInfoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEditing = () => setIsEditing((prev) => !prev);

    const { mutate: updateUser, isPending } = useUpdateUser({ toggleEditing });

    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: user.name ?? "",
            gender: user.gender as GENDER ?? undefined,
            dob: user.dob ?? undefined,
            phone: user.phone ?? "",
            email: user.email ?? "",
            image: user.image ?? "",
        }
    });

    const onSubmit = (data: z.infer<typeof UserSchema>) => {
        updateUser({ json: data });
    }

    console.log(form.formState.errors);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center gap-x-2">
                    <span>Personal Information</span>
                    <Button variant={isEditing ? "destructive" : "secondary"} onClick={toggleEditing} disabled={isPending}>
                        {isEditing ? "Cancel" : "Update"}
                    </Button>
                </CardTitle>
                <CardDescription>
                    You can edit your personal information here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending || !isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex gap-x-3"
                                            disabled={isPending || !isEditing}
                                        >
                                            {
                                                Object.values(GENDER).map((gender) => (
                                                    <FormItem className="flex items-center space-x-1 space-y-0" key={gender}>
                                                        <FormControl>
                                                            <RadioGroupItem value={gender} checked={field.value === gender} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal capitalize">
                                                            {gender}
                                                        </FormLabel>
                                                    </FormItem>
                                                ))
                                            }
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date of birth</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01") || !isEditing
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
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