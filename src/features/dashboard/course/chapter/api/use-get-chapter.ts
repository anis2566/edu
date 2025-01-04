import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.chapter[":chapterId"]["$get"]>;

export const useGetChapter = (chapterId: string) => {

    const query = useQuery<ResponseType>({
        queryKey: ["chapter", chapterId],
        queryFn: async () => {
            const res = await client.api.chapter[":chapterId"]["$get"]({
                param: { chapterId },
            });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};