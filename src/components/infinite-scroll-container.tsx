import { useInView } from "react-intersection-observer";

import { cn } from "@/lib/utils";

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
    onBottomReached: () => void;
    className?: string;
}

export default function InfiniteScrollContainer({
    children,
    onBottomReached,
    className,
}: InfiniteScrollContainerProps) {
    const { ref } = useInView({
        rootMargin: "200px",
        onChange(inView) {
            if (inView) {
                onBottomReached();
            }
        },
    });

    return (
        <div className={cn("flex flex-col items-center", className)}>
            {children}
            <div ref={ref} />
        </div>
    );
}