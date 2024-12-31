import { SearchIcon } from "lucide-react"

interface Props {
    title: string;
}

export const EmptyStat = ({ title }: Props) => {
    return (
        <div className="w-full min-h-[30vh] flex flex-col items-center justify-center gap-4">
            <SearchIcon className="w-10 h-10 text-muted-foreground" />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-lg font-semibold">{title}</h1>
                <p className="text-sm text-muted-foreground">Please try to search with similar keyword or create one</p>
            </div>
        </div>
    )
}