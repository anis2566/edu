import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.submission["$post"]>;
type RequestType = InferRequestType<typeof client.api.submission["$post"]>

interface UseCreateSubmissionProps {
    onClose: () => void;
    form: UseFormReturn<{ fileUrl: string }>
}

export const useCreateSubmission = ({ onClose, form }: UseCreateSubmissionProps) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const res = await client.api.submission["$post"]({
                json,
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                queryClient.invalidateQueries({ queryKey: ["chapter"] });
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