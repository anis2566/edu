import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.answer[":questionId"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.answer[":questionId"]["$post"]>

interface UseCreateAnswerProps {
    onClose: () => void;
    form: UseFormReturn<{ answer: string }>
}

export const useCreateAnswer = ({ onClose, form }: UseCreateAnswerProps) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const res = await client.api.answer[":questionId"]["$post"]({
                param: { questionId: param.questionId },
                json,
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                queryClient.invalidateQueries({ queryKey: ["questions-admin"] });
                queryClient.invalidateQueries({ queryKey: ["questions-home"] });
                form.reset();
                onClose();
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