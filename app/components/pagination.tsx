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
}

export default function Pagination({ next, className, ...props }: Props) {
  const pages = getPages({ next });
  return (
    <div className={cn("", className)} {...props}>
      <Comp>
        <PaginationContent>
          <PaginationItem>
            {pages.previous && (
              <PaginationPrevious
                href={`?${convertPageToQuery(pages.previous)}`}
              />
            )}
          </PaginationItem>
          {pages.content.map((p) => (
            <PaginationItem key={p.index}>
              <PaginationLink
                href={`?${convertPageToQuery(p)}`}
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
                <PaginationNext href={`?${convertPageToQuery(pages.next)}`} />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Comp>
    </div>
  );
}
