import { Link } from "@remix-run/react";
import { CheckCircle, Clock, Loader2, RefreshCcw, XCircle } from "lucide-react";
import { HTMLAttributes, useMemo } from "react";

import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { JobStatistics } from "~/models/job-statistics";
import { JobStatus, JobStatuses } from "~/models/job-status";

interface Props extends HTMLAttributes<HTMLDivElement> {
  statistics: JobStatistics;
}

export default function StatisticsCard({
  statistics,
  className,
  ...props
}: Props) {
  const total = useMemo(
    () =>
      Object.values(statistics).reduce(
        (sum: number, count: number) => sum + count,
        0,
      ),
    [statistics],
  );

  return (
    <Card className={cn("w-full min-w-[400px]", className)} {...props}>
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-between gap-2">
          {JobStatuses.filter((it) => it !== "success").map((status) => (
            <Item
              key={status}
              status={status}
              count={statistics[status]}
              total={total}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Item({
  status,
  count,
  total,
}: {
  status: JobStatus;
  count: number;
  total: number;
}) {
  const percentage = useMemo(
    () => (total === 0 ? 0 : (count / total) * 100),
    [count, total],
  );

  return (
    <Link
      to={`/jobs?status=${status}`}
      className={cn(
        "group flex flex-col items-center p-2 rounded-lg hover:bg-accent transition-colors",
        "w-[calc(20%-0.4rem)]",
      )}
    >
      <Icon status={status} />
      <span className="text-xs font-medium capitalize mt-1 text-center">
        {status}
      </span>
      <span className="text-sm font-bold mt-1">{count}</span>
      <span className="text-xs text-muted-foreground mt-1">
        {percentage.toFixed(1)}%
      </span>
    </Link>
  );
}

function Icon({ status }: { status: JobStatus }) {
  const iconProps = { className: "w-4 h-4" };
  switch (status) {
    case "queued":
      return (
        <Clock
          {...iconProps}
          className={cn(iconProps.className, "text-yellow-500")}
        />
      );
    case "processing":
      return (
        <Loader2
          {...iconProps}
          className={cn(iconProps.className, "text-blue-500")}
        />
      );
    case "retrying":
      return (
        <RefreshCcw
          {...iconProps}
          className={cn(iconProps.className, "text-purple-500")}
        />
      );
    case "success":
      return (
        <CheckCircle
          {...iconProps}
          className={cn(iconProps.className, "text-green-500")}
        />
      );
    case "failed":
      return (
        <XCircle
          {...iconProps}
          className={cn(iconProps.className, "text-red-500")}
        />
      );
  }
}
