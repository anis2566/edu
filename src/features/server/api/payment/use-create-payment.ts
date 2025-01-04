import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.payment.$post>;
type RequestType = InferRequestType<
    typeof client.api.payment.$post
>["json"];

export const useCreatePayment = () => {
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.payment.$post({ json });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("paymentUrl" in data) {
                router.push(data.paymentUrl);
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