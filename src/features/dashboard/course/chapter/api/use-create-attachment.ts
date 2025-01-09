import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { UseFormReturn } from "react-hook-form";

type ResponseType = InferResponseType<typeof client.api.attachment[":chapterId"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.attachment[":chapterId"]["$post"]>

interface UseCreateAttachmentProps {
    toggleEdit: () => void;
    form: UseFormReturn<{ title: string; url: string }>
}

export const useCreateAttachment = ({ toggleEdit, form }: UseCreateAttachmentProps) => {
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const res = await client.api.attachment[":chapterId"]["$post"]({
                param,
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