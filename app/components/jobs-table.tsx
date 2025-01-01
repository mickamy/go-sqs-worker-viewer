import { HTMLAttributes, ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { Job } from "~/models/job";

interface Props extends HTMLAttributes<HTMLTableElement> {
  jobs: Job[];
}

export default function JobsTable({ jobs, className, ...props }: Props) {
  return (
    <Table className={cn("", className)} {...props}>
      <TableHeader>
        <TableRow>
          {columns.map((it) => (
            <TableHead
              key={it}
              className="py-2 px-4 text-left text-gray-500 font-bold border-b border-gray-200 whitespace-nowrap"
            >
              {it}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            {renderCell(() => job.id)}
            {renderCell(() => job.type)}
            {renderCell(() => job.payload)}
            {renderCell(() => job.status)}
            {renderCell(() => job.retry_count)}
            {renderCell(() => job.caller)}
            {renderCell(() => job.created_at)}
            {renderCell(() => job.updated_at)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function renderCell(children: () => ReactNode) {
  return (
    <TableCell className="py-2 px-4 font-medium border-b border-gray-200 whitespace-nowrap">
      {children()}
    </TableCell>
  );
}

const columns = [
  "ID",
  "Type",
  "Payload",
  "Status",
  "Retry Count",
  "Caller",
  "Created At",
  "Updated At",
];
