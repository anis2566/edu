import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.course.$post>;
type RequestType = InferRequestType<
    typeof client.api.course.$post
>["json"];

export const useCreateCourse = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const res = await client.api.course.$post({ json });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                queryClient.invalidateQueries({ queryKey: ["courses"] });
                router.push(`/dashboard/course/${data.courseId}`);
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