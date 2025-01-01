import { useLoaderData } from "@remix-run/react";

import JobsTable from "~/components/jobs-table";
import { Job } from "~/models/job";

interface LoaderData {
  jobs: Job[];
}

export default function QueuedScreen() {
  const { jobs } = useLoaderData<LoaderData>();
  return (
    <>
      <JobsTable jobs={jobs} />
    </>
  );
}
