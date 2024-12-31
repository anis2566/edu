import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.category.$get>;

export const useGetCategories = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const q = searchParams.get("query") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["categories", page, limit, sort, q],
        queryFn: async () => {
            const res = await client.api.category.$get({
                query: { page, limit, sort, query: q },
            });
            const parseData = await res.json();
            return {
                categories: parseData.categories,
                totalCount: parseData.totalCount,
            };
        },
    });

    return query;
};