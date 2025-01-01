import { useLoaderData } from "@remix-run/react";

import JobsTable from "~/components/jobs-table";
import Pagination from "~/components/pagination";
import Spacer from "~/components/spacer";
import { Job } from "~/models/job";
import { Page } from "~/models/page";

export interface LoaderData {
  jobs: Job[];
  next: Page;
}

export default function JobsScreen() {
  const { jobs, next } = useLoaderData<LoaderData>();
  return (
    <>
      <JobsTable jobs={jobs} />
      <Spacer size={12} />
      <Pagination next={next} />
    </>
  );
}
