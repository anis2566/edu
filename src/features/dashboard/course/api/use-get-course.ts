import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.course.$get>;

export const useGetCourses = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const q = searchParams.get("query") || undefined;
    const categoryQuery = searchParams.get("categoryQuery") || undefined;
    const status = searchParams.get("status") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["courses", page, limit, sort, q, categoryQuery, status],
        queryFn: async () => {
            const res = await client.api.course.$get({
                query: { page, limit, sort, query: q, categoryQuery, status },
            });
            const parseData = await res.json();
            return {
                courses: parseData.courses,
                totalCount: parseData.totalCount,
            };
        },
    });

    return query;
};