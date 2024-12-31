import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.current.$get>;

export const useCurrent = () => {
    const query = useQuery<ResponseType, Error>({
        queryKey: ["current"],
        queryFn: async () => {
            const res = await client.api.auth.current.$get();
            const user = await res.json();
            return user;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    return query;
};