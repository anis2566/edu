"use client";

import { useGetVideoOtp } from "@/features/dashboard/course/chapter/api/use-get-video-otp";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    videoId: string;
    className?: string;
}

export const VideoPlayer = ({ videoId, className }: VideoPlayerProps) => {
    const { data } = useGetVideoOtp(videoId);

    if (!data) return null;

    return (
        <div className={cn("relative aspect-video rounded-md")}>
            <iframe
                src={`https://player.vdocipher.com/v2/?otp=${data?.otp}&playbackInfo=${data?.playbackInfo}`}
                allowFullScreen={true}
                allow="encrypted-media"
                className={cn("h-full w-full rounded-md border-none", className)}
            ></iframe>
        </div>
    );
};