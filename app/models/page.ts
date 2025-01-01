export interface Page {
  index: number;
  size: number;
  total: number;
}

export function convertPageToQuery(page: Page): string {
  return `index=${page.index}`;
}

interface Pages {
  previous: Page | null;
  content: Page[];
  next: Page | null;
}

export function getPages({ next }: { next: Page }): Pages {
  if (next.size <= 0) {
    throw new Error("invalid page size");
  }

  const pages: Pages = {
    previous: null,
    content: [],
    next: null,
  };

  const totalPage = Math.ceil(next.total / next.size);
  if (totalPage <= 1) {
    pages.content.push({
      index: 0,
      size: next.size,
      total: next.total,
    });
    return pages;
  }

  const start = Math.max(0, next.index - 2);
  const end = Math.min(totalPage, start + 5);
  const total = next.total;

  if (start > 0) {
    pages.previous = { index: start - 1, size: next.size, total };
  }

  for (let i = start; i < end; i++) {
    pages.content.push({ index: i, size: next.size, total });
  }

  if (end < totalPage) {
    pages.next = { index: end, size: next.size, total };
  }

  return pages;
}
