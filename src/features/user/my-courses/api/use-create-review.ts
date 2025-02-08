import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.review[":courseId"]["$post"]>;
type RequestType = InferRequestType<
    typeof client.api.review[":courseId"]["$post"]
>

interface UseCreateReviewProps {
    onClose: () => void;
}

export const useCreateReview = ({ onClose }: UseCreateReviewProps) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param, json }) => {
            const res = await client.api.review[":courseId"]["$post"]({ param, json });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                queryClient.invalidateQueries({ queryKey: ["my-courses"] });
                queryClient.invalidateQueries({ queryKey: ["courses-home"] });
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