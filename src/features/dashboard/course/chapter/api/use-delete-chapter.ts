import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api.chapter)[":chapterId"]["$delete"]
>;
type ResponseType = InferResponseType<
    (typeof client.api.chapter)[":chapterId"]["$delete"]
>;

interface Props {
    onClose: () => void;
}

export const useDeleteChapter = ({ onClose }: Props) => {
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const res = await client.api.chapter[":chapterId"]["$delete"]({
                param: { chapterId: param.chapterId },
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, { duration: 5000 });
                onClose();
            }

            if ("error" in data) {
                toast.error(data.error, { duration: 5000 });
            }
        },
        onError: (error) => {
            toast.error(error.message, { duration: 5000 });
        },
    });

    return mutation;
};