import { LoaderIcon } from "lucide-react"

export const Loader = () => {
    return (
        <div className="flex justify-center">
            <LoaderIcon className="w-5 h-5 animate-spin" />
        </div>
    )
}