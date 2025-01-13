"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

export const Header = () => {
    const [limit, setLimit] = useState<string>("");
    const [sort, setSort] = useState<string>("");

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (value: string) => {
        setSort(value);

        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    ...params,
                    sort: value,
                },
            },
            { skipNull: true, skipEmptyString: true },
        );

        router.push(url);
    };

    const handleLimitChange = (value: string) => {
        setLimit(value);

        const params = Object.fromEntries(searchParams.entries());
        const { ...filteredParams } = params;
        const url = queryString.stringifyUrl(
            {
                url: pathname,
                query: {
                    ...filteredParams,
                    limit: value,
                },
            },
            { skipNull: true, skipEmptyString: true },
        );

        router.push(url);
    };

    const handleReset = () => {
        setLimit("5");
        setSort("");

        router.push(pathname);
    };

    return (
        <div className="flex items-center justify-between">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="block md:hidden">
                        Filter
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="p-4">
                    <DrawerHeader>
                        <DrawerTitle>Filter</DrawerTitle>
                    </DrawerHeader>

                    <div className="space-y-5">
                        <div className="flex items-center justify-end">
                            <DrawerClose asChild>
                                <Button variant="destructive" size="sm">
                                    Close
                                </Button>
                            </DrawerClose>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <Select
                                    value={sort}
                                    onValueChange={(value) => handleSortChange(value)}
                                >
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desc">Newest</SelectItem>
                                        <SelectItem value="asc">Oldest</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={limit || ""}
                                    onValueChange={(value) => handleLimitChange(value)}
                                >
                                    <SelectTrigger className="w-[90px]">
                                        <SelectValue placeholder="Limit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["5", "10", "20", "50", "100", "200"].map((v, i) => (
                                            <SelectItem value={v} key={i}>
                                                {v}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <DrawerClose asChild>
                                <Button variant="outline" onClick={handleReset} size="sm" className="text-red-500">
                                    Clear Filter
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            <div className="hidden md:flex items-center gap-x-2">
                <Select
                    value={sort}
                    onValueChange={(value) => handleSortChange(value)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest</SelectItem>
                        <SelectItem value="asc">Oldest</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="destructive" onClick={handleReset} size="sm">
                    Clear Filter
                </Button>
            </div>

            <Select
                value={limit || ""}
                onValueChange={(value) => handleLimitChange(value)}
            >
                <SelectTrigger className="w-[90px]">
                    <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                    {["5", "10", "20", "50", "100", "200"].map((v, i) => (
                        <SelectItem value={v} key={i}>
                            {v}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
};