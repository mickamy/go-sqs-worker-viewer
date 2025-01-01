import { HTMLAttributes } from "react";

import Spacer from "~/components/spacer";
import { cn } from "~/lib/utils";
import { JobStatistics, JobStatus, JobStatuses } from "~/models/job-statistics";

interface Props extends HTMLAttributes<HTMLUListElement> {
  statistics: JobStatistics;
}

export default function StatisticsCard({
  statistics,
  className,
  ...props
}: Props) {
  return (
    <ul
      className={cn(
        "flex flex-col justify-between p-2 list-none",
        "md:flex-row",
        "rounded-sm bg-card border border-gray-200",
        className
      )}
      {...props}
    >
      <li>
        <Spacer />
      </li>
      {JobStatuses.map((status) => (
        <li key={status}>
          <Item status={status} statistics={statistics} />
        </li>
      ))}
      <li>
        <Spacer />
      </li>
    </ul>
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
    <div
      className={cn(
        "flex flex-row items-center justify-between",
        "md:flex-col-reverse md:space-x-0"
      )}
    >
      <div className="text-md md:text-sm">{status}</div>
      <div className="text-sm md:text-xs">{statistics[status]}</div>
    </div>
  );
}
