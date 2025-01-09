import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.question[":chapterId"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.question[":chapterId"]["$post"]>
type QuestionResponseType = InferResponseType<typeof client.api.question.home[":chapterId"]["$get"]>

interface UseCreateQuestionProps {
    onClose: () => void;
}

export const useCreateQuestion = ({ onClose }: UseCreateQuestionProps) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const res = await client.api.question[":chapterId"]["$post"]({
                json,
                param: {
                    chapterId: param.chapterId,
                },
            });
            return await res.json();
        },
        onSuccess: async (data) => {

            if ("success" in data) {
                const queryKey: QueryKey = ["questions-home", data.chapterId];

                await queryClient.cancelQueries({ queryKey });

                queryClient.setQueryData<InfiniteData<QuestionResponseType, string | null>>(
                    queryKey,
                    (oldData) => {
                        const firstPage = oldData?.pages[0];
                        if (firstPage) {
                            return {
                                pageParams: oldData.pageParams,
                                pages: [
                                    {
                                        previousCursor: firstPage.previousCursor,
                                        questions: [...firstPage.questions, data.question],
                                    },
                                    ...oldData.pages.slice(1),
                                ],
                            };
                        }
                    },
                );

                queryClient.invalidateQueries({
                    queryKey,
                    predicate(query) {
                        return !query.state.data;
                    },
                });

                toast.success(data.success, {
                    duration: 5000,
                });
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