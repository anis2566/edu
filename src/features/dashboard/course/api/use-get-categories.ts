import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.category.forSelect.$get>

export const useGetCategories = (q: string | undefined) => {
    const query = useQuery<ResponseType, Error>({
        queryKey: ["categories", q],
        queryFn: async () => {
            const res = await client.api.category.forSelect.$get({
                query: {
                    query: q
                }
            });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};