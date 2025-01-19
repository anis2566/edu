import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.home.courses["$get"]>;

export const useGetCourses = (categoryId: string | undefined) => {
    const query = useQuery<ResponseType>({
        queryKey: ["courses", categoryId],
        queryFn: async () => {
            const res = await client.api.home.courses["$get"]({
                query: { categoryId },
            });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};