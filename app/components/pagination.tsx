import { HTMLAttributes } from "react";

import {
  Pagination as Comp,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { cn } from "~/lib/utils";
import { convertPageToQuery, getPages, Page } from "~/models/page";

export interface Props extends HTMLAttributes<HTMLDivElement> {
  next: Page;
  defaultQuery?: string;
}

export default function Pagination({
  next,
  defaultQuery,
  className,
  ...props
}: Props) {
  const pages = getPages({ next });
  return (
    <div className={cn("", className)} {...props}>
      <Comp>
        <PaginationContent>
          <PaginationItem>
            {pages.previous && (
              <PaginationPrevious
                href={query({ page: pages.previous, defaultQuery })}
              />
            )}
          </PaginationItem>
          {pages.content.map((p) => (
            <PaginationItem key={p.index}>
              <PaginationLink
                href={query({ page: p, defaultQuery })}
                isActive={next.index - 1 == p.index}
              >
                {p.index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {pages.next && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={query({ page: pages.next, defaultQuery })}
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Comp>
    </div>
  );
}

function query({ page, defaultQuery }: { page: Page; defaultQuery?: string }) {
  if (defaultQuery) {
    return `?${defaultQuery}&${convertPageToQuery(page)}`;
  }
  return `?${convertPageToQuery(page)}`;
}
