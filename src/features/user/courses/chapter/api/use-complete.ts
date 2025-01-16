import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import { useConfettiStore } from "@/hooks/use-confetti";

type RequestType = InferRequestType<(typeof client.api.chapter.toggleCompleted)[":chapterId"]["$put"]>;
type ResponseType = InferResponseType<(typeof client.api.chapter.toggleCompleted)[":chapterId"]["$put"]>;

export const useToggleComplete = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { onOpen } = useConfettiStore()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const res = await client.api.chapter.toggleCompleted[":chapterId"]["$put"]({
                param: { chapterId: param.chapterId },
                json,
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                onOpen()
                queryClient.invalidateQueries({ queryKey: ["chapter"] });
                router.refresh();
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
