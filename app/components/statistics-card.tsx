import { HTMLAttributes } from "react";

import { cn } from "~/lib/utils";
import { JobStatistics, JobStatus, JobStatuses } from "~/models/job-statistics";

interface Props extends HTMLAttributes<HTMLDivElement> {
  statistics: JobStatistics;
}

export default function StatisticsCard({
  statistics,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-between space-x-4",
        "p-2",
        "rounded-lg bg-card border border-gray-200",
        className
      )}
      {...props}
    >
      {JobStatuses.map((status) => (
        <Item key={status} status={status} statistics={statistics} />
      ))}
    </div>
  );
}

function Item({
  status,
  statistics,
}: {
  status: JobStatus;
  statistics: JobStatistics;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[150px]">
      <div className="text-xs">{statistics[status]}</div>
      <div className="text-sm">{status}</div>
    </div>
  );
}
