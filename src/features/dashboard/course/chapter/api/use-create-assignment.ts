import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";

import { client } from "@/lib/rpc";
import { AssignmentSchemaType } from "../schema";

type ResponseType = InferResponseType<typeof client.api.assignment[":chapterId"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.assignment[":chapterId"]["$post"]>

interface UseCreateAssignmentProps {
    toggleEdit: () => void;
    form: UseFormReturn<AssignmentSchemaType>
}

export const useCreateAssignment = ({ toggleEdit, form }: UseCreateAssignmentProps) => {
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const res = await client.api.assignment[":chapterId"]["$post"]({
                param: {
                    chapterId: param.chapterId,
                },
                json,
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                router.refresh();
                form.reset();
                toggleEdit();
            }

            if ("error" in data) {
                toast.error(data.error, {
                    duration: 5000,
                });
            }
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 5000,
            });
        },
    });

    return mutation;
};