import { useLoaderData } from "@remix-run/react";

import JobsTable from "~/components/jobs-table";
import { cn } from "~/lib/utils";
import { Job } from "~/models/job";

export interface LoaderData {
  jobs: Job[];
}

export default function JobsScreen() {
  const { jobs } = useLoaderData<LoaderData>();

  return (
    <div className="overflow-x-auto">
      <JobsTable jobs={jobs} className={cn("mx-auto")} />
    </div>
  );
}
