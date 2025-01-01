import { LoaderFunction } from "@remix-run/node";

import { JobStatus, JobStatuses } from "~/models/job-statistics";
import JobsScreen, { LoaderData } from "~/routes/jobs/components/jobs-screen";
import { getJobs } from "~/service/job-service";

const size = 100;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const status = params.get("status");
  if (!status || !(JobStatuses as string[]).includes(status)) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const index = parseInt(params.get("index") || "0", 10);
  const { jobs, total } = await getJobs({
    index,
    count: size,
    status: status as JobStatus,
  });

  return { jobs, next: { index: index + 1, size, total } } as LoaderData;
};

export default function Queued() {
  return <JobsScreen />;
}
