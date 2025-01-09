import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.assignment[":assignmentId"]["$delete"]>;
type RequestType = InferRequestType<typeof client.api.assignment[":assignmentId"]["$delete"]>

interface UseDeleteAssignmentProps {
    onClose: () => void;
}

export const useDeleteAssignment = ({ onClose }: UseDeleteAssignmentProps) => {
    const router = useRouter();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const res = await client.api.assignment[":assignmentId"]["$delete"]({
                param,
            });
            return await res.json();
        },
        onSuccess: (data) => {
            if ("success" in data) {
                toast.success(data.success, {
                    duration: 5000,
                });
                router.refresh();
                onClose();
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