import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.course.featured["$get"]>;

export const useGetFeaturedCourses = () => {

    const query = useQuery<ResponseType>({
        queryKey: ["home-featured"],
        queryFn: async () => {
            const res = await client.api.course.featured["$get"]();
            const parseData = await res.json();
            return parseData;
        },
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    return query;
};