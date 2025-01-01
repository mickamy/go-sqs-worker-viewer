import { LoaderFunction } from "@remix-run/node";

import { JobStatus, JobStatuses } from "~/models/job-statistics";
import JobsScreen, { LoaderData } from "~/routes/jobs/components/jobs-screen";
import { getAllJobs } from "~/service/job-service";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const status = params.get("status");
  if (!status || !(JobStatuses as string[]).includes(status)) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const jobs = getAllJobs({ status: status as JobStatus }).then(
    (it) => it.jobs,
  );
  return { jobs } as LoaderData;
};

export default function Queued() {
  return <JobsScreen />;
}
