"use client"

import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import queryString from "query-string"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useDebounce } from "@/hooks/use-debounce"

export const Search = () => {
    const [search, setSearch] = useState<string>("")

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchValue = useDebounce(search, 500);

    useEffect(() => {
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    query: searchValue,
                },
            },
            { skipEmptyString: true, skipNull: true },
        );

        router.push(url);
    }, [router, pathname, searchValue]);

    const handleSortChange = (sort: string) => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    ...params,
                    sort,
                },
            },
            { skipEmptyString: true, skipNull: true },
        );

        router.push(url);
    };

    return (
        <div className="flex items-center justify-center relative">
            <div className="relative w-full max-w-[500px]">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="appearance-none bg-background pl-8 shadow-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <Select onValueChange={(value) => handleSortChange(value)}>
                <SelectTrigger className="w-full max-w-[130px] absolute right-0 top-0">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="desc">Newest</SelectItem>
                    <SelectItem value="asc">Oldest</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
