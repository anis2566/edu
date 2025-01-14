import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    (typeof client.api.user)["$put"]
>;
type ResponseType = InferResponseType<
    (typeof client.api.user)["$put"]
>;

interface UseUpdateUserProps {
    toggleEditing: () => void;
}

export const useUpdateUser = ({ toggleEditing }: UseUpdateUserProps) => {
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const res = await client.api.user["$put"]({
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
                toggleEditing();
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