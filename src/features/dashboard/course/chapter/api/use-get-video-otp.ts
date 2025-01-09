import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.videoCipher.otp[":videoId"]["$get"]>;

export const useGetVideoOtp = (videoId: string) => {

    const query = useQuery<ResponseType>({
        queryKey: ["videoOtp", videoId],
        queryFn: async () => {
            const res = await client.api.videoCipher.otp[":videoId"]["$get"]({
                param: { videoId },
            });
            const parseData = await res.json();
            return parseData;
        },
    });

    return query;
};