import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api.attachment)[":attachmentId"]["$delete"]
>;
type ResponseType = InferResponseType<
    (typeof client.api.attachment)[":attachmentId"]["$delete"]
>;

interface Props {
    onClose: () => void;
}

export const useDeleteAttachment = ({ onClose }: Props) => {
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const res = await client.api.attachment[":attachmentId"]["$delete"]({
                param: { attachmentId: param.attachmentId },
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, { duration: 5000 });
                router.refresh();
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