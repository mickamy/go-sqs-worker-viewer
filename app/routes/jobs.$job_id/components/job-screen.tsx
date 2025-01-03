import { useLoaderData } from "@remix-run/react";
import { useCallback } from "react";

import { Job } from "~/models/job";
import JobCard from "~/routes/jobs.$job_id/components/job-card";

export interface LoaderData {
  job: Job;
}

export default function JobScreen() {
  const { job } = useLoaderData<LoaderData>();
  const onStatusChange = useCallback(
    ({ id, newStatus }: { id: string; newStatus: string }) => {
      console.log("status change", id, newStatus);
    },
    [],
  );
  return (
    <div className="mx-auto">
      <JobCard job={job} onStatusChange={onStatusChange} />
    </div>
  );
}
