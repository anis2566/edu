import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/rpc";

export const useGetCourses = () => {
    const searchParams = useSearchParams();
    const cursor = searchParams.get("cursor") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const query = searchParams.get("query") || undefined;

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: ["courses-home", cursor, sort, query],
            queryFn: async () => {
                const res = await client.api.course.home["$get"]({
                    query: { cursor, sort, query },
                });
                const parseData = await res.json();
                return {
                    courses: parseData.courses,
                    nextCursor: parseData.nextCursor,
                };
            },
            initialPageParam: null as string | null,
            getNextPageParam: (firstPage) => firstPage.nextCursor,
            select: (data) => ({
                pages: [...data.pages].reverse(),
                pageParams: [...data.pageParams].reverse(),
            }),
        });

    const courses = data?.pages.flatMap((page) => page.courses) || [];

    return {
        courses,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    };
};