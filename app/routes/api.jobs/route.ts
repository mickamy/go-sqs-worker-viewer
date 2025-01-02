import { LoaderFunction } from "@remix-run/node";

import { JobStatus, JobStatuses } from "~/models/job-statistics";
import { getJobs } from "~/service/job-service";

const chunkSize = 50;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const status = params.get("status");
  const cursor = parseInt(params.get("cursor") || "0", 10);
  if (!status || !(JobStatuses as string[]).includes(status)) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const { jobs, nextCursor } = await getJobs({
    status: status as JobStatus,
    cursor,
    chunkSize,
  });
  return Response.json({ jobs, nextCursor });
};
