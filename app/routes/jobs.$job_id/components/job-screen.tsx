import { useLoaderData } from "@remix-run/react";

import { Job } from "~/models/job";
import JobCard from "~/routes/jobs.$job_id/components/job-card";

export interface LoaderData {
  job: Job;
}

export default function JobScreen() {
  const { job } = useLoaderData<LoaderData>();
  return <JobCard job={job} />;
}
