"use client";

import { useSearchParams } from "next/navigation";

import { PaginationWithLinks, type PaginationWithLinksProps } from "@/components/ui/pagination-with-link";


const defaultProps: PaginationWithLinksProps = {
    page: 1,
    totalCount: 0,
    pageSize: 5,
};

export function CustomPagination({ ...rest }: Partial<PaginationWithLinksProps>) {
    const searchParams = useSearchParams();
    const page = rest.page || Number.parseInt(searchParams.get("page") || "1");
    const pageSize =
        rest.pageSize ||
        Number.parseInt(searchParams.get(rest.pageSizeSelectOptions?.pageSizeSearchParam || "pageSize") || "5");

    return (
        <div>
            <PaginationWithLinks {...defaultProps} page={page} pageSize={pageSize} {...rest} />
        </div>
    );
}