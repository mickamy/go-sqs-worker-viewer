import { useLoaderData } from "@remix-run/react";

import { Job } from "~/models/job";
import JobCard from "~/routes/jobs.$job_id/components/job-card";

export interface LoaderData {
  job: Job;
}

export default function JobScreen() {
  const { job } = useLoaderData<LoaderData>();
  return (
    <div className="mx-auto">
      <JobCard job={job} />
    </div>
  );
}
