import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { HTMLAttributes, ReactNode } from "react";

import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
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

interface Props extends HTMLAttributes<HTMLDivElement> {
  jobs?: Job[];
  skeleton?: boolean;
  onClickRow?: (job: Job) => void;
}

export default function JobsTable({
  jobs,
  skeleton = false,
  onClickRow,
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
    <div
      className={cn(
        "overflow-x-auto rounded-lg border min-w-[800px]",
        className,
      )}
      {...props}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className="py-3 px-4 text-sm font-medium text-muted-foreground"
              >
                {column.label}
              </TableHead>
            ))}
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeleton ? (
            <SkeletonRows />
          ) : jobs?.length === 0 ? (
            <EmptyState />
          ) : (
            jobs?.map((job) => (
              <TableRow
                key={job.id}
                className="group cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onClickRow?.(job)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="py-3 px-4">
                    {renderCellContent(column, job)}
                  </TableCell>
                ))}
                <TableCell className="w-8">
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function renderCellContent(column: ColumnDef, job: Job): ReactNode {
  switch (column.key) {
    case "id":
      return <span className="font-medium">{job.id}</span>;
    case "type":
      return <Badge variant="outline">{job.type}</Badge>;
    case "caller":
      return <span className="text-muted-foreground">{job.caller}</span>;
    case "createdAt":
      return (
        <span className="text-muted-foreground">
          {format(new Date(job.created_at), "PPp")}
        </span>
      );
    default:
      return null;
  }
}

function SkeletonRows() {
  return Array.from({ length: 20 }).map((_, index) => (
    <TableRow key={index}>
      {columns.map((column) => (
        <TableCell key={column.key} className="py-3 px-4">
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
      <TableCell className="w-8" />
    </TableRow>
  ));
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={columns.length + 1} className="h-24 text-center">
        <div className="text-muted-foreground">No jobs available.</div>
      </TableCell>
    </TableRow>
  );
}

type ColumnDef = {
  key: string;
  label: string;
};

const columns: ColumnDef[] = [
  { key: "id", label: "ID" },
  { key: "type", label: "Type" },
  { key: "caller", label: "Caller" },
  { key: "createdAt", label: "Created At" },
];
