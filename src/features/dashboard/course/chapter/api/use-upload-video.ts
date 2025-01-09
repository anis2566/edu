import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.videoCipher[":chapterId"]["$post"]>;
type RequestType = InferRequestType<
    typeof client.api.videoCipher[":chapterId"]["$post"]
>

interface UploadVideoParams {
    onClose: () => void;
    setIsEditing: Dispatch<SetStateAction<boolean>> | undefined;
}

export const useUploadVideo = ({ onClose, setIsEditing }: UploadVideoParams) => {
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form, param }) => {
            const res = await client.api.videoCipher[":chapterId"]["$post"]({
                param,
                form,
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                onClose();
                router.refresh();
                if (setIsEditing) {
                    setIsEditing(false);
                }
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