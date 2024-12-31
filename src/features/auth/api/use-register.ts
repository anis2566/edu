import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
    typeof client.api.auth.register.$post
>["json"];
type ResponseType = InferResponseType<
    typeof client.api.auth.register.$post
>;

interface UseRegisterProps {
    redirectUrl?: string;
}

export const useRegister = ({ redirectUrl }: UseRegisterProps = {}) => {
    const router = useRouter();

    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.auth.register.$post({ json });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("error" in data) {
                toast.error(data.error, {
                    duration: 5000,
                });
                return;
            }

            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                queryClient.invalidateQueries({ queryKey: ["current-user"] });
                router.push(redirectUrl || "/auth/sign-in");
            }
        },
    });

    return mutation;
};