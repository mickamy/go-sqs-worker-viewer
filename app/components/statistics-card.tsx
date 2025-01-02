import { Link } from "@remix-run/react";
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
        "rounded-sm bg-card border border-gray-200",
        "min-w-[200px] md:min-w-[300px] md:flex md:space-x-2",
        "md:flex-row",
        className,
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
        "md:flex-col-reverse md:space-x-0",
      )}
    >
      <Link
        to={`/jobs?status=${status}`}
        className="hover:underline hover:underline-offset-4 hover:text-primary"
      >
        <div className="text-sm md:text-sm">{status}</div>
      </Link>
      <div className="text-sm md:text-sm">{statistics[status]}</div>
    </div>
  );
}
