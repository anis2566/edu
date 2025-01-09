import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.category.all.$get>;

export const useGetAllCategory = () => {
    const query = useQuery<ResponseType>({
        queryKey: ["categories-all"],
        queryFn: async () => {
            const res = await client.api.category.all.$get();
            const parseData = await res.json();
            return {
                categories: parseData.categories,
            };
        },
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return query;
};