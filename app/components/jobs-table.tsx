import { HTMLAttributes, ReactNode } from "react";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { Job } from "~/models/job";

interface Props extends HTMLAttributes<HTMLTableElement> {
  jobs?: Job[];
  skeleton?: boolean;
}

export default function JobsTable({
  jobs,
  skeleton = false,
  className,
  ...props
}: Props) {
  if (!skeleton && !jobs) {
    throw new Error("jobs is required");
  }
  if (skeleton && jobs) {
    throw new Error("jobs should be undefined when skeleton is true");
  }

  return (
    <table className={cn("", className)} {...props}>
      <TableHeader>
        <TableRow>
          {columns.map((it) => (
            <TableHead
              key={it}
              className="py-2 px-4 text-sm text-left text-gray-500 border-b border-gray-200 whitespace-nowrap"
            >
              {it}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {skeleton ? (
          Array.from({ length: 20 }).map((_, index) => (
            <TableRow key={index}>
              {columns.map((_, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className="py-2 px-4 border-b border-gray-200 animate-pulse"
                >
                  <div className="h-4 bg-gray-300 rounded-md"></div>
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : jobs?.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="py-4 text-center text-gray-500 border-b border-gray-200"
            >
              No jobs available.
            </TableCell>
          </TableRow>
        ) : (
          jobs?.map((job) => (
            <TableRow key={job.id}>
              {renderCell(() => job.id)}
              {renderCell(() => job.type)}
              {renderCell(() => job.caller)}
              {renderCell(() => job.created_at)}
            </TableRow>
          ))
        )}
      </TableBody>
    </table>
  );
}

function renderCell(children: () => ReactNode) {
  return (
    <TableCell
      className={cn(
        "py-2 px-4 border-b border-gray-200 text-sm overflow-hidden whitespace-nowrap text-ellipsis",
      )}
    >
      {children()}
    </TableCell>
  );
}

const columns = ["ID", "Type", "Caller", "Created At"];
