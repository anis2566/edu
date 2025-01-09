import { useInfiniteQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import kyInstance from "@/lib/ky";

type ResponseType = InferResponseType<typeof client.api.question.home[":chapterId"]["$get"]>;

interface UseGetQuestionsProps {
    chapterId: string;
}

export const useGetQuestions = ({ chapterId }: UseGetQuestionsProps) => {
    const { data, fetchNextPage, hasNextPage, isFetching, status } =
        useInfiniteQuery({
            queryKey: ["questions-home", chapterId],
            queryFn: ({ pageParam }) =>
                kyInstance
                    .get(
                        `/api/question/home/${chapterId}`,
                        pageParam ? { searchParams: { cursor: pageParam } } : {},
                    )
                    .json<ResponseType>(),
            initialPageParam: null as string | null,
            getNextPageParam: (firstPage) => firstPage.previousCursor,
            select: (data) => ({
                pages: [...data.pages].reverse(),
                pageParams: [...data.pageParams].reverse(),
            }),
        });

    const questions = data?.pages.flatMap((page) => page.questions) || [];

    return {
        questions,
        fetchNextPage,
        hasNextPage,
        isFetching,
        status,
    };
};