import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

import JobsTable from "~/components/jobs-table";
import { Job } from "~/models/job";

export interface LoaderData {
  jobs: Promise<Job[]>;
}

export default function JobsScreen() {
  const { jobs } = useLoaderData<LoaderData>();

  return (
    <div className="overflow-x-auto">
      <Suspense fallback={<JobsTable skeleton className="mx-auto" />}>
        <Await resolve={jobs}>
          {(jobs) => <JobsTable jobs={jobs} className="mx-auto" />}
        </Await>
      </Suspense>
    </div>
  );
}
