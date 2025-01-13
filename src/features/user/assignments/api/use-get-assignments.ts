import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.submission.$get>;

export const useGetAssignments = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;
    const sort = searchParams.get("sort") || undefined;

    const query = useQuery<ResponseType>({
        queryKey: ["user-submissions", page, limit, sort],
        queryFn: async () => {
            const res = await client.api.submission.$get({
                query: { page, limit, sort },
            });
            const parseData = await res.json();
            return {
                submissions: parseData.submissions,
                totalCount: parseData.totalCount,
            };
        },
    });

    return query;
};