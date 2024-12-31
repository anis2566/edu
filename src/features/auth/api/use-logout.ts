import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.logout.$post>;

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, void>({
        mutationFn: async () => {
            const res = await client.api.auth.logout.$post();
            return await res.json();
        },
        onSuccess: (data) => {
            toast.success(data.success, {
                duration: 5000,
            });
            queryClient.invalidateQueries({ queryKey: ["current"] });
            router.push("/");
        },
    });

    return mutation;
};