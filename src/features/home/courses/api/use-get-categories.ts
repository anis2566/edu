import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.home.categories["$get"]>;

export const useGetCategories = () => {

    const query = useQuery<ResponseType>({
        queryKey: ["home-categories"],
        queryFn: async () => {
            const res = await client.api.home.categories["$get"]();
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};